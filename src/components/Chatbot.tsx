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
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-[9999] group hover:scale-110 border-2 border-white sm:right-6"
        title="Open AI Chatbot - Get bid predictions and assistance"
        style={{ 
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          minWidth: '60px',
          minHeight: '60px',
          position: 'fixed',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)'
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
      {isOpen && (
        <div className="fixed top-1/2 right-20 transform -translate-y-1/2 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9998] flex flex-col overflow-hidden sm:right-24"
             style={{
               boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
               backdropFilter: 'blur(10px)',
               position: 'fixed',
               right: '80px',
               top: '50%',
               transform: 'translateY(-50%)',
               maxWidth: 'calc(100vw - 100px)',
               width: 'min(384px, calc(100vw - 100px))'
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
      )}
    </>
  );
};

export default Chatbot;
