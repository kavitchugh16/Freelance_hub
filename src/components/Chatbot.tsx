import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaUser, FaPaperPlane, FaTimes } from 'react-icons/fa';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Draggable state
  const [position, setPosition] = useState({ x: window.innerWidth - 76, y: window.innerHeight / 2 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [hasMoved, setHasMoved] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadGreeting();
    }
  }, [isOpen]);

  // Load position from localStorage on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('chatbotPosition');
    if (savedPosition) {
      try {
        const { x, y } = JSON.parse(savedPosition);
        setPosition({ x, y });
      } catch (error) {
        console.error('Error loading chatbot position:', error);
      }
    }
  }, []);

  // Save position to localStorage when it changes
  useEffect(() => {
    if (!isDragging) {
      localStorage.setItem('chatbotPosition', JSON.stringify(position));
    }
  }, [position, isDragging]);

  // Handle window resize to keep button within bounds
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      setWindowSize({ width: newWidth, height: newHeight });
      setPosition(prev => ({
        x: Math.min(prev.x, newWidth - 30),
        y: Math.min(prev.y, newHeight - 30)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  // Mouse event handlers for dragging - optimized for smooth performance
  const dragStartPos = useRef({ x: 0, y: 0 });
  const currentDragPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return; // Only handle left mouse button
    
    const button = buttonRef.current;
    if (!button) return;
    
    const buttonRect = button.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    
    // Calculate offset from mouse to button center
    const offsetX = startX - (buttonRect.left + buttonRect.width / 2);
    const offsetY = startY - (buttonRect.top + buttonRect.height / 2);
    
    dragStartPos.current = { x: startX, y: startY };
    currentDragPos.current = { x: position.x, y: position.y };
    
    setIsDragging(true);
    setHasMoved(false);
    setDragOffset({ x: offsetX, y: offsetY });
    
    // Add smooth transition removal during drag for better performance
    button.style.transition = 'none';
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    
    e.preventDefault();
    e.stopPropagation();
    
    const handleMouseMove = (e: MouseEvent) => {
      // Mark that mouse has moved if moved more than 3px (to distinguish drag from click)
      const moveDelta = Math.abs(e.clientX - dragStartPos.current.x) + Math.abs(e.clientY - dragStartPos.current.y);
      if (moveDelta > 3) {
        setHasMoved(true);
      }
      
      // Calculate new position
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;
      
      // Constrain to viewport bounds
      const buttonSize = 60;
      newX = Math.max(buttonSize / 2, Math.min(window.innerWidth - buttonSize / 2, newX));
      newY = Math.max(buttonSize / 2, Math.min(window.innerHeight - buttonSize / 2, newY));
      
      currentDragPos.current = { x: newX, y: newY };
      
      // Use requestAnimationFrame for smooth updates
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(() => {
        if (button) {
          // Direct DOM manipulation for smoother performance
          button.style.left = `${newX}px`;
          button.style.top = `${newY}px`;
        }
      });
    };

    const handleMouseUp = () => {
      // Cancel any pending animation frame
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      
      // Restore transition
      if (button) {
        button.style.transition = '';
      }
      
      // Update React state with final position
      setPosition(currentDragPos.current);
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      
      // Reset hasMoved after a short delay to allow onClick to check it
      setTimeout(() => setHasMoved(false), 10);
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp, { once: true });
  };

  const loadGreeting = async () => {
    try {
      const response = await fetch('http://localhost:5000/greeting');
      const data = await response.json();
      addMessage('bot', data.greeting);
      setIsConnected(true);
    } catch (error) {
      console.error('Error loading greeting:', error);
      addMessage('bot', '🤖 Welcome to the Freelance Bid Prediction Chatbot!\n\nI\'ll help you predict freelance bid outcomes by collecting information about your project.\n\nLet\'s get started!');
      setIsConnected(false);
    }
  };

  const addMessage = (type: 'user' | 'bot', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      addMessage('bot', data.response);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('bot', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: 'Status', action: 'status' },
    { label: 'Reset', action: 'reset' },
    { label: 'Predict', action: 'predict' }
  ];

  const sendQuickMessage = (action: string) => {
    setInputMessage(action);
    sendMessage();
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          // Only toggle if mouse hasn't moved (user clicked, not dragged)
          if (!hasMoved && !isDragging) {
            setIsOpen(!isOpen);
          }
        }}
        onMouseDown={handleMouseDown}
        className={`fixed bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl z-[9999] group border-2 border-white ${
          isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:scale-110'
        }`}
        title="Drag to move • Click to open AI Chatbot"
        style={{ 
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          width: '60px',
          height: '60px',
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          touchAction: 'none',
          willChange: isDragging ? 'transform, left, top' : 'auto',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out, box-shadow 0.2s ease-out'
        }}
      >
        {isOpen ? (
          <FaTimes size={24} className="sm:w-7 sm:h-7" />
        ) : (
          <FaRobot size={24} className="group-hover:animate-bounce sm:w-7 sm:h-7" />
        )}
        {/* Connection Status Indicator */}
        {!isOpen && (
          <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white ${
            isConnected ? 'bg-green-400' : 'bg-red-400'
          } animate-pulse`}></div>
        )}
        {/* Pulse animation for attention */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-20"></div>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (() => {
        const windowWidth = 384;
        const windowHeight = 500;
        // Calculate position relative to button, but keep within viewport
        let windowX = position.x - 200; // Offset to the left of button
        let windowY = position.y;
        
        // Keep window within viewport bounds
        if (windowX < windowWidth / 2) windowX = windowWidth / 2;
        if (windowX > windowSize.width - windowWidth / 2) windowX = windowSize.width - windowWidth / 2;
        if (windowY < windowHeight / 2) windowY = windowHeight / 2;
        if (windowY > windowSize.height - windowHeight / 2) windowY = windowSize.height - windowHeight / 2;
        
        return (
          <div className="fixed w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9998] flex flex-col overflow-hidden"
               style={{
                 boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                 backdropFilter: 'blur(10px)',
                 position: 'fixed',
                 left: `${windowX}px`,
                 top: `${windowY}px`,
                 transform: 'translate(-50%, -50%)',
                 maxWidth: 'calc(100vw - 40px)',
                 width: 'min(384px, calc(100vw - 40px))',
                 maxHeight: 'calc(100vh - 40px)',
                 height: 'min(500px, calc(100vh - 40px))'
               }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaRobot size={20} />
              <div>
                <h3 className="font-semibold">Bid Prediction Bot</h3>
                <p className="text-xs opacity-90">AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && (
                      <FaRobot size={16} className="mt-1 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <FaUser size={16} className="mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <FaRobot size={16} />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-gray-200">
            <div className="flex space-x-2 mb-2">
              {quickActions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => sendQuickMessage(action.action)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:opacity-80 disabled:opacity-50 transition-opacity"
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
          </div>
        </div>
        );
      })()}
    </>
  );
};

export default Chatbot;
