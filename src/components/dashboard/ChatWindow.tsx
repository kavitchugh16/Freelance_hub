// src/components/dashboard/ChatWindow.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
// --- 1. IMPORT NEW API FUNCTIONS ---
import { getConversations, getMessages, searchUsers, getOrCreateConversation } from '../../services/api';
import './ChatWindow.css'; 

// --- (Your interfaces are here) ---
interface IUser {
  _id: string;
  username: string;
  profile?: {
    fullName?: string;
    avatar?: string;
  };
}
interface IMessage {
  _id: string;
  conversationId: string;
  sender: IUser; 
  text: string;
  createdAt: string;
}
interface IConversation {
  _id: string;
  participants: IUser[];
  lastMessage?: {
    text: string;
    sender: { _id: string; username: string };
  };
  recipient: IUser;
}
// ----------------------------------

export const ChatWindow: React.FC = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // --- 2. ADD NEW STATE FOR SEARCH ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const messageEndRef = useRef<null | HTMLDivElement>(null);

  // Effect 1: Fetch all conversations on component load
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      try {
        const res = await getConversations();
        setConversations(res.data);
      } catch (err) {
        console.error('Failed to fetch conversations API error:', err);
      }
    };
    
    fetchConversations();
  }, [user]);

  // --- 3. ADD NEW EFFECT FOR DEBOUNCED SEARCH ---
  useEffect(() => {
    // Clear search results if search term is empty
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    // Debounce: Wait 500ms after user stops typing
    const delayDebounceFn = setTimeout(() => {
      const performSearch = async () => {
        try {
          const res = await searchUsers(searchTerm);
          setSearchResults(res.data);
        } catch (err) {
          console.error('Failed to search users:', err);
        } finally {
          setIsSearching(false);
        }
      };
      performSearch();
    }, 500);

    // Cleanup function to cancel the timeout
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // ... (Effect 2: Fetch messages) ...
  useEffect(() => {
    if (!selectedConversation) return;
    // ... (rest of the effect)
    const fetchMessages = async () => {
      try {
        const res = await getMessages(selectedConversation._id);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    };
    fetchMessages();
    if (socket) {
      socket.emit('joinRoom', selectedConversation._id);
    }
  }, [selectedConversation, socket]);


  // ... (Effect 3: Listen for incoming messages) ...
  useEffect(() => {
    if (!socket) return;
    // ... (rest of the effect)
    const handleReceiveMessage = (incomingMessage: IMessage) => {
      if (incomingMessage.conversationId === selectedConversation?._id) {
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      }
      setConversations(prevConvos => 
        prevConvos.map(convo => {
          if (convo._id === incomingMessage.conversationId) {
            return {
              ...convo,
              lastMessage: {
                text: incomingMessage.text,
                sender: { _id: incomingMessage.sender._id, username: incomingMessage.sender.username }
              }
            };
          }
          return convo;
        })
      );
    };
    socket.on('receiveMessage', handleReceiveMessage);
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, selectedConversation]);

  // ... (Effect 4: Auto-scroll) ...
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // Handler: Send a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedConversation || !user) return;
    // ... (rest of the handler)
    socket.emit('sendMessage', {
      conversationId: selectedConversation._id,
      senderId: user._id,
      recipientId: selectedConversation.recipient._id,
      text: newMessage,
    });
    setNewMessage('');
  };

  // --- 4. NEW HANDLER: Start chat from search result ---
  const handleSelectUser = async (selectedUser: IUser) => {
    try {
      // Check if a conversation with this user already exists
      const existingConvo = conversations.find(c => c.recipient._id === selectedUser._id);
      if (existingConvo) {
        setSelectedConversation(existingConvo);
        setSearchTerm('');
        setSearchResults([]);
        return;
      }

      // If not, create a new one
      const res = await getOrCreateConversation(selectedUser._id);
      const newConversation = res.data;
      
      // Manually add the 'recipient' field to match the IConversation interface
      const recipient = newConversation.participants.find((p: IUser) => p._id !== user._id);
      const fullNewConversation = { ...newConversation, recipient };

      // Add to state and select it
      setConversations([fullNewConversation, ...conversations]);
      setSelectedConversation(fullNewConversation);
      
      // Clear search
      setSearchTerm('');
      setSearchResults([]);

    } catch (err) {
      console.error('Failed to create conversation', err);
    }
  };


  // --- (Your JSX is here) ---
  return (
    <div className="chat-container">
      {/* --- CONVERSATION LIST (SIDEBAR) --- */}
      <div className="conversation-list">
        <h2>Messages</h2>
        
        {/* --- 5. ADD SEARCH BAR --- */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search for users..."
            className="chat-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* --- 6. CONDITIONAL RENDER: SEARCH RESULTS OR CONVOS --- */}
        {searchTerm.trim() ? (
          <div className="search-results-list">
            {isSearching && <p className="search-info">Searching...</p>}
            {!isSearching && searchResults.length === 0 && (
              <p className="search-info">No users found.</p>
            )}
            {searchResults.map((foundUser) => (
              <div
                key={foundUser._id}
                className="convo-item"
                onClick={() => handleSelectUser(foundUser)}
              >
                <div className="avatar-container">
                  <img
                    src={foundUser.profile?.avatar || '/default-avatar.png'}
                    alt="avatar"
                  />
                </div>
                <div className="convo-details">
                  <strong>{foundUser.profile?.fullName || foundUser.username}</strong>
                  <p>Click to start chatting</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="conversation-items-list">
            {conversations.length === 0 && (
              <p style={{padding: '1rem', color: '#666'}}>No conversations yet.</p>
            )}
            {conversations.map((convo) => {
              const recipient = convo.recipient;
              const isOnline = onlineUsers.includes(recipient._id);
              return (
                <div
                  key={convo._id}
                  className={`convo-item ${
                    selectedConversation?._id === convo._id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedConversation(convo)}
                >
                  <div className="avatar-container">
                    <img
                      src={recipient.profile?.avatar || '/default-avatar.png'}
                      alt="avatar"
                    />
                    {isOnline && <div className="online-dot"></div>}
                  </div>
                  <div className="convo-details">
                    <strong>{recipient.profile?.fullName || recipient.username}</strong>
                    <p>{convo.lastMessage?.text ? convo.lastMessage.text.substring(0, 30) + '...' : 'No messages yet'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- MESSAGE PANEL (MAIN) --- */}
      {/* ... (This part remains exactly the same) ... */}
      <div className="message-panel">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <h3>{selectedConversation.recipient.profile?.fullName || selectedConversation.recipient.username}</h3>
              <span className={onlineUsers.includes(selectedConversation.recipient._id) ? 'online' : 'offline'}>
                {onlineUsers.includes(selectedConversation.recipient._id) ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="message-list">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message-bubble ${
                    msg.sender._id === user._id ? 'sent' : 'received'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            <form className="message-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>No messages yet. Say hello!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;