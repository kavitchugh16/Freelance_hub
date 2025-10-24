// src/components/dashboard/ChatWindow.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { getConversations, getMessages, searchUsers, getOrCreateConversation } from '../../services/api';
// --- 1. IMPORT SCSS INSTEAD OF CSS ---
import './ChatWindow.scss'; // Make sure you rename the CSS file

// --- Interfaces ---
interface IUser { /* ... */ _id: string; username: string; profile?: { fullName?: string; avatar?: string; }; }
interface IMessage { /* ... */ _id: string; conversationId: string; sender: IUser; text: string; createdAt: string; }
interface IConversation { /* ... */ _id: string; participants: IUser[]; lastMessage?: { text: string; sender: { _id: string; username: string }; }; recipient: IUser; }
// ------------------

export const ChatWindow: React.FC = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();

  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const messageEndRef = useRef<null | HTMLDivElement>(null);

  // Effect 1: Fetch conversations
  useEffect(() => { /* ... */ if (!user) return; const fetchConversations = async () => { try { const res = await getConversations(); setConversations(res.data); } catch (err) { console.error('Failed to fetch conversations:', err); } }; fetchConversations(); }, [user]);

  // Effect 2: Debounced Search
  useEffect(() => { /* ... */ if (searchTerm.trim() === '') { setSearchResults([]); setIsSearching(false); return; } setIsSearching(true); const delayDebounceFn = setTimeout(() => { const performSearch = async () => { try { const res = await searchUsers(searchTerm); setSearchResults(res.data); } catch (err) { console.error('Failed search:', err); } finally { setIsSearching(false); } }; performSearch(); }, 500); return () => clearTimeout(delayDebounceFn); }, [searchTerm]);

  // Effect 3: Fetch messages
  useEffect(() => { /* ... */ if (!selectedConversation) return; const fetchMessages = async () => { try { const res = await getMessages(selectedConversation._id); setMessages(res.data); } catch (err) { console.error('Failed messages:', err); } }; fetchMessages(); if (socket) { socket.emit('joinRoom', selectedConversation._id); } }, [selectedConversation, socket]);

  // Effect 4: Listen for incoming messages
  useEffect(() => { /* ... */ if (!socket) return; const handleReceiveMessage = (incomingMessage: IMessage) => { if (incomingMessage.conversationId === selectedConversation?._id) { setMessages((prev) => [...prev, incomingMessage]); } setConversations(prev => prev.map(convo => convo._id === incomingMessage.conversationId ? { ...convo, lastMessage: { text: incomingMessage.text, sender: { _id: incomingMessage.sender._id, username: incomingMessage.sender.username } } } : convo)); }; socket.on('receiveMessage', handleReceiveMessage); return () => { socket.off('receiveMessage', handleReceiveMessage); }; }, [socket, selectedConversation]);

  // Effect 5: Auto-scroll
  useEffect(() => { /* ... */ messageEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Handler: Send message
  const handleSendMessage = (e: React.FormEvent) => { /* ... */ e.preventDefault(); if (!newMessage.trim() || !socket || !selectedConversation || !user) return; socket.emit('sendMessage', { conversationId: selectedConversation._id, senderId: user._id, recipientId: selectedConversation.recipient._id, text: newMessage }); setNewMessage(''); };

  // Handler: Select user from search
  const handleSelectUser = async (selectedUser: IUser) => { /* ... */ try { const existingConvo = conversations.find(c => c.recipient._id === selectedUser._id); if (existingConvo) { setSelectedConversation(existingConvo); setSearchTerm(''); setSearchResults([]); return; } const res = await getOrCreateConversation(selectedUser._id); const newConversation = res.data; const recipient = newConversation.participants.find((p: IUser) => p._id !== user._id); const fullNewConversation = { ...newConversation, recipient }; setConversations([fullNewConversation, ...conversations]); setSelectedConversation(fullNewConversation); setSearchTerm(''); setSearchResults([]); } catch (err) { console.error('Failed create convo:', err); } };

  return (
    <div className="chat-container">
      {/* --- CONVERSATION LIST (SIDEBAR) --- */}
      <div className="conversation-list">
        <h2 className="sidebar-title">Messages</h2>
        <div className="search-bar-container">
          <input type="text" placeholder="Search or start new chat..." className="chat-search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {searchTerm.trim() ? (
          <div className="search-results-list sidebar-scrollable">
            {isSearching && <p className="sidebar-info">Searching...</p>}
            {!isSearching && searchResults.length === 0 && <p className="sidebar-info">No users found.</p>}
            {searchResults.map((foundUser) => (
              <div key={foundUser._id} className="convo-item" onClick={() => handleSelectUser(foundUser)}>
                <div className="avatar-container">
                  <img src={foundUser.profile?.avatar || '/default-avatar.png'} alt="avatar" />
                  {/* No online dot for search results */}
                </div>
                <div className="convo-details">
                  <strong>{foundUser.profile?.fullName || foundUser.username}</strong>
                  <p className="start-chat-text">Click to start chatting</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="conversation-items-list sidebar-scrollable">
            {conversations.length === 0 && <p className="sidebar-info">No conversations yet.</p>}
            {conversations.map((convo) => {
              const recipient = convo.recipient;
              const isOnline = onlineUsers.includes(recipient._id);
              return (
                <div key={convo._id} className={`convo-item ${selectedConversation?._id === convo._id ? 'selected' : ''}`} onClick={() => setSelectedConversation(convo)}>
                  <div className="avatar-container">
                    <img src={recipient.profile?.avatar || '/default-avatar.png'} alt="avatar" />
                    {isOnline && <div className="online-dot pulsing-dot"></div>} {/* Added pulsing class */}
                  </div>
                  <div className="convo-details">
                    <strong>{recipient.profile?.fullName || recipient.username}</strong>
                    <p>{convo.lastMessage?.text ? convo.lastMessage.text : 'No messages yet'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- MESSAGE PANEL (MAIN) --- */}
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
                <div key={msg._id} className={`message-bubble-wrapper ${msg.sender._id === user?._id ? 'sent' : 'received'}`}>
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                    <span className="message-timestamp">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            <form className="message-input-area" onSubmit={handleSendMessage}>
              <input type="text" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a conversation or search to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;