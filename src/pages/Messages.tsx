// src/pages/Messages.tsx
import React from 'react';
import ChatWindow from '../components/dashboard/ChatWindow'; // Check this path

const MessagesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Messages</h1>
      <ChatWindow />
    </div>
  );
};

export default MessagesPage;