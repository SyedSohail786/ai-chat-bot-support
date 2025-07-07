// components/FullScreenChat.jsx
"use client";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  FiSend,
  FiUser,
  FiMessageSquare
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function FullScreenChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const sampleMessages = [
    {
      id: 1,
      text: "Hello! I'm your business support assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000)
    }
  ];

  useEffect(() => {
    setMessages(sampleMessages);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = {
      text: input,
      sender: 'user',
      id: Date.now(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/chat`, {
        sessionId: 'user-session-123',
        message: input
      });

      const botMsg = {
        text: data.reply,
        sender: 'bot',
        id: Date.now() + 1,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
        id: Date.now() + 1,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full overflow-x-hidden flex flex-col h-[calc(100vh-64px)]">
      {/* Chat Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600">
            <FiMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Business Support</h1>
            <p className="text-xs text-gray-500">
              {isLoading ? 'AI is typing...' : 'Online'}
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
            <FiMessageSquare className="w-12 h-12 mb-4 opacity-30" />
            <h3 className="text-lg font-medium text-gray-500">No messages yet</h3>
            <p className="mt-1">Start a conversation with our support team</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%] break-words">
                    <div
                      className={`rounded-2xl p-4 ${msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {msg.sender === 'bot' && (
                          <div className="flex-shrink-0 mt-0.5 p-1.5 bg-blue-100 rounded-full text-blue-600">
                            <FiMessageSquare className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                        {msg.sender === 'user' && (
                          <div className="flex-shrink-0 mt-0.5 p-1.5 bg-blue-700 rounded-full text-white">
                            <FiUser className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4" onClick={() => inputRef.current?.focus()}>
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <input
              key="chat-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="w-full pr-12 pl-4 py-3 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type your message..."
              disabled={isLoading}
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 p-2 rounded-full ${input.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400'} transition-colors`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiSend className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Our AI assistant may produce inaccurate information
          </p>
        </div>
      </div>
    </div>
  );
}
