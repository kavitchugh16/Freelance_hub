import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const Messages = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState('');

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = user?._id || user?.id;
    if (!token || !userId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API_BASE}/messages`, {
          params: { userId },
          headers: { Authorization: `Bearer ${token}` }
        });
        const list = Array.isArray(res.data) ? res.data : [];
        if (list.length === 0) {
          // Fallback dummy conversations
          const dummy = [
            {
              _id: 'c1',
              peerName: 'Client Alpha',
              lastMessage: 'Please share the latest update.',
              messages: [
                { _id: 'm1', fromSelf: false, text: 'Please share the latest update.', ts: new Date().toISOString() },
                { _id: 'm2', fromSelf: true, text: 'Working on it, will send by EOD.', ts: new Date().toISOString() }
              ]
            },
            {
              _id: 'c2',
              peerName: 'Freelancer Beta',
              lastMessage: 'Sent the draft for review.',
              messages: [
                { _id: 'm3', fromSelf: false, text: 'Sent the draft for review.', ts: new Date().toISOString() },
                { _id: 'm4', fromSelf: true, text: 'Got it, reviewing now.', ts: new Date().toISOString() }
              ]
            }
          ];
          setConversations(dummy);
          setActiveId(dummy[0]._id);
        } else {
          setConversations(list);
          setActiveId(list[0]?._id || null);
        }
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const activeConversation = useMemo(() => conversations.find(c => c._id === activeId) || null, [conversations, activeId]);

  const handleSend = () => {
    if (!input.trim()) return;
    // For now, push locally; real-time requires websockets/events
    const newMsg = { _id: String(Math.random()), fromSelf: true, text: input.trim(), ts: new Date().toISOString() };
    setConversations(prev => prev.map(c => c._id === activeId ? { ...c, lastMessage: newMsg.text, messages: [...(c.messages || []), newMsg] } : c));
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border rounded-lg h-[70vh] grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Sidebar */}
          <aside className="border-r md:col-span-1 overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              {error && <div className="mt-2 rounded bg-red-50 border border-red-200 p-2 text-xs text-red-700">{error}</div>}
            </div>
            {loading ? (
              <div className="p-4 text-sm">Loading...</div>
            ) : (
              <ul className="divide-y">
                {conversations.map(c => (
                  <li key={c._id} className={`p-4 cursor-pointer ${activeId === c._id ? 'bg-gray-50' : ''}`} onClick={() => setActiveId(c._id)}>
                    <p className="text-sm font-medium text-gray-900">{c.peerName || 'Conversation'}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{c.lastMessage || 'Start chatting...'}</p>
                  </li>
                ))}
                {conversations.length === 0 && (
                  <li className="p-4 text-sm text-gray-600">No conversations yet.</li>
                )}
              </ul>
            )}
          </aside>

          {/* Chat Window */}
          <section className="md:col-span-2 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium text-gray-900">{activeConversation?.peerName || 'Chat'}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
              {(activeConversation?.messages || []).map(m => (
                <div key={m._id} className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.fromSelf ? 'ml-auto bg-indigo-600 text-white' : 'mr-auto bg-white border'}`}>
                  <p className="whitespace-pre-line">{m.text}</p>
                  <p className="mt-1 text-[10px] opacity-70">{new Date(m.ts).toLocaleTimeString()}</p>
                </div>
              ))}
              {(!activeConversation || (activeConversation?.messages || []).length === 0) && (
                <div className="text-center text-xs text-gray-500">No messages yet. Say hello!</div>
              )}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
              />
              <button onClick={handleSend} className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700">Send</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Messages;


