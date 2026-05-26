'use client';

import { useState, useRef, useEffect } from 'react';

function formatTime(date) {
  return (date instanceof Date ? date : new Date(date)).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! Welcome to Brady's Detail Shop. How can I help you today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const hasInteracted = useRef(false);

  // Auto-open after 5 seconds if the user has not manually interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted.current) {
        setIsOpen(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Listen for the "Book Now" button event
  useEffect(() => {
    function handleOpenChat() {
      hasInteracted.current = true;
      setIsOpen(true);
    }
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  // Clear unread badge when opened
  useEffect(() => {
    if (isOpen) setHasUnread(false);
  }, [isOpen]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  function handleBubbleClick() {
    hasInteracted.current = true;
    setIsOpen(prev => !prev);
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input, time: new Date() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      const assistantMsg = { role: 'assistant', text: data.reply, time: new Date() };

      setMessages(prev => [...prev, assistantMsg]);
      if (!isOpen) setHasUnread(true);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Something went wrong. Please try again.',
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') sendMessage();
  }

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3">

      {isOpen && (
        <div className="w-[min(320px,calc(100vw-2rem))] h-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-blue-600 px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <p className="text-white font-semibold text-sm">Brady's Detail Shop</p>
              <p className="text-blue-200 text-xs">AI Receptionist • Online</p>
            </div>
            <button onClick={() => { hasInteracted.current = true; setIsOpen(false); }} className="text-white text-lg leading-none">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-gray-100 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
                <span className="text-gray-500 text-[10px] mt-1 px-1">
                  {formatTime(msg.time)}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-400 px-3 py-2 rounded-xl rounded-bl-none text-sm">
                  Typing...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-700 flex gap-2 shrink-0">
            <input
              className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none placeholder-gray-500"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              Send
            </button>
          </div>

        </div>
      )}

      {/* Bubble Button */}
      <button
        onClick={handleBubbleClick}
        className="relative w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-2xl transition"
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && hasUnread && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-zinc-950" />
        )}
      </button>

    </div>
  );
}
