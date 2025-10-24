// // src/components/dashboard/ChatWindow.tsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { useSocket } from '../../contexts/SocketContext';
// import { getConversations, getMessages } from '../../services/api';
// import './ChatWindow.css'; // We will create this CSS file next

// // --- DEFINE TYPES ---
// interface IUser {
//   _id: string;
//   username: string;
//   profile?: {
//     fullName?: string;
//     avatar?: string;
//   };
// }

// interface IMessage {
//   _id: string;
//   conversationId: string;
//   sender: IUser; // This is populated by our backend fix
//   text: string;
//   createdAt: string;
// }

// interface IConversation {
//   _id: string;
//   participants: IUser[];
//   lastMessage?: {
//     text: string;
//     sender: { _id: string; username: string };
//   };
//   // This 'recipient' field is what we added in the chat.controller.js
//   recipient: IUser;
// }

// // --- CHAT COMPONENT ---
// export const ChatWindow: React.FC = () => {
//   const { user } = useAuth();
//   const { socket, onlineUsers } = useSocket();

//   const [conversations, setConversations] = useState<IConversation[]>([]);
//   const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [newMessage, setNewMessage] = useState('');
  
//   // Ref to auto-scroll to the bottom
//   const messageEndRef = useRef<null | HTMLDivElement>(null);

//   // Effect 1: Fetch all conversations on component load
//   useEffect(() => {
//     if (!user) return;

//     const fetchConversations = async () => {
//       try {
//         const res = await getConversations();
//         setConversations(res.data);
//       } catch (err) {
//         console.error('Failed to fetch conversations', err);
//       }
//     };
//     fetchConversations();
//   }, [user]);

//   // Effect 2: Fetch messages when a conversation is selected
//   useEffect(() => {
//     if (!selectedConversation) return;

//     const fetchMessages = async () => {
//       try {
//         const res = await getMessages(selectedConversation._id);
//         setMessages(res.data);
//       } catch (err) {
//         console.error('Failed to fetch messages', err);
//       }
//     };
//     fetchMessages();

//     // Join the socket room for this conversation
//     if (socket) {
//       socket.emit('joinRoom', selectedConversation._id);
//     }
//   }, [selectedConversation, socket]);

//   // Effect 3: Listen for incoming messages from the socket
//   useEffect(() => {
//     if (!socket) return;

//     const handleReceiveMessage = (incomingMessage: IMessage) => {
//       // Check if the message belongs to the currently open conversation
//       if (incomingMessage.conversationId === selectedConversation?._id) {
//         setMessages((prevMessages) => [...prevMessages, incomingMessage]);
//       }
      
//       // Also, update the last message in the conversation list (optional but nice)
//       setConversations(prevConvos => 
//         prevConvos.map(convo => {
//           if (convo._id === incomingMessage.conversationId) {
//             return {
//               ...convo,
//               lastMessage: {
//                 text: incomingMessage.text,
//                 sender: { _id: incomingMessage.sender._id, username: incomingMessage.sender.username }
//               }
//             };
//           }
//           return convo;
//         })
//       );
//     };

//     socket.on('receiveMessage', handleReceiveMessage);

//     // Cleanup listener on unmount
//     return () => {
//       socket.off('receiveMessage', handleReceiveMessage);
//     };
//   }, [socket, selectedConversation]);

//   // Effect 4: Auto-scroll to the latest message
//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Handler: Send a new message
//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !socket || !selectedConversation || !user) return;

//     // Emit the message to the server
//     socket.emit('sendMessage', {
//       conversationId: selectedConversation._id,
//       senderId: user._id,
//       recipientId: selectedConversation.recipient._id,
//       text: newMessage,
//     });

//     setNewMessage('');
//   };

//   return (
//     <div className="chat-container">
//       {/* --- CONVERSATION LIST (SIDEBAR) --- */}
//       <div className="conversation-list">
//         <h2>Chats</h2>
//         {conversations.map((convo) => {
//           const recipient = convo.recipient;
//           const isOnline = onlineUsers.includes(recipient._id);
//           return (
//             <div
//               key={convo._id}
//               className={`convo-item ${
//                 selectedConversation?._id === convo._id ? 'selected' : ''
//               }`}
//               onClick={() => setSelectedConversation(convo)}
//             >
//               <div className="avatar-container">
//                 <img
//                   src={recipient.profile?.avatar || '/default-avatar.png'} // Add a default avatar to your /public folder
//                   alt="avatar"
//                 />
//                 {isOnline && <div className="online-dot"></div>}
//               </div>
//               <div className="convo-details">
//                 <strong>{recipient.profile?.fullName || recipient.username}</strong>
//                 <p>{convo.lastMessage?.text ? convo.lastMessage.text.substring(0, 30) + '...' : 'No messages yet'}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* --- MESSAGE PANEL (MAIN) --- */}
//       <div className="message-panel">
//         {selectedConversation ? (
//           <>
//             {/* Header */}
//             <div className="chat-header">
//               <h3>{selectedConversation.recipient.profile?.fullName || selectedConversation.recipient.username}</h3>
//               <span className={onlineUsers.includes(selectedConversation.recipient._id) ? 'online' : 'offline'}>
//                 {onlineUsers.includes(selectedConversation.recipient._id) ? 'Online' : 'Offline'}
//               </span>
//             </div>

//             {/* Messages */}
//             <div className="message-list">
//               {messages.map((msg) => (
//                 <div
//                   key={msg._id}
//                   className={`message-bubble ${
//                     msg.sender._id === user._id ? 'sent' : 'received'
//                   }`}
//                 >
//                   <p>{msg.text}</p>
//                   <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                 </div>
//               ))}
//               {/* This empty div is the target for auto-scrolling */}
//               <div ref={messageEndRef} />
//             </div>

//             {/* Input Form */}
//             <form className="message-input" onSubmit={handleSendMessage}>
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//               />
//               <button type="submit">Send</button>
//             </form>
//           </>
//         ) : (
//           <div className="no-chat-selected">
//             <p>Select a conversation to start chatting.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;

// src/components/dashboard/ChatWindow.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { getConversations, getMessages } from '../../services/api';
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
  
  const messageEndRef = useRef<null | HTMLDivElement>(null);

  // --- Effect 1: Fetch all conversations on component load ---
  // --- I HAVE ADDED DEBUG LOGS HERE ---
  useEffect(() => {
    console.log('ChatWindow trying to fetch conversations...');
    
    if (!user) {
      console.error('Fetch FAILED: The "user" object from AuthContext is null.');
      return;
    }

    console.log('Fetch SUCCESS: User found. Calling getConversations().', user);
    
    const fetchConversations = async () => {
      try {
        const res = await getConversations();
        console.log('API Response for getConversations:', res.data);
        setConversations(res.data);
      } catch (err) {
        console.error('Failed to fetch conversations API error:', err);
      }
    };
    
    fetchConversations();
  }, [user]);
  // -----------------------------------------------------------

  // Effect 2: Fetch messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

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

  // Effect 3: Listen for incoming messages from the socket
  useEffect(() => {
    if (!socket) return;

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

  // Effect 4: Auto-scroll to the latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handler: Send a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedConversation || !user) return;

    socket.emit('sendMessage', {
      conversationId: selectedConversation._id,
      senderId: user._id,
      recipientId: selectedConversation.recipient._id,
      text: newMessage,
    });

    setNewMessage('');
  };

  // --- (Your JSX is here) ---
  return (
    <div className="chat-container">
      {/* --- CONVERSATION LIST (SIDEBAR) --- */}
      <div className="conversation-list">
        <h2>Messages</h2>
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

      {/* --- MESSAGE PANEL (MAIN) --- */}
      <div className="message-panel">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="chat-header">
              <h3>{selectedConversation.recipient.profile?.fullName || selectedConversation.recipient.username}</h3>
              <span className={onlineUsers.includes(selectedConversation.recipient._id) ? 'online' : 'offline'}>
                {onlineUsers.includes(selectedConversation.recipient._id) ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Messages */}
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

            {/* Input Form */}
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