'use client';

import React, { useState, useRef, useEffect } from 'react';

// Inline SVG for Paper Airplane Icon
const PaperAirplaneIconSVG = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" 
    />
  </svg>
);

// Define a message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = input;
    setInput('');

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: Date.now().toString() + '-ai',
        text: data.reply || 'Error: No reply from AI',
        sender: 'ai',
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);

    } catch (error) {
      console.error("Failed to send message to backend:", error);
      const errorResponse: Message = {
        id: Date.now().toString() + '-ai-error',
        text: 'Sorry, I couldn\'t connect to the AI. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-foreground">AI Health Assistant</h1>
      
      {/* Chat Messages Area */}
      <div className="flex-grow overflow-y-auto mb-4 p-4 bg-card rounded-lg shadow space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-right mt-1 opacity-75">
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center p-2 bg-card rounded-lg shadow">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about your health..."
          className="flex-grow p-3 bg-transparent focus:outline-none text-foreground placeholder-muted-foreground rounded-md"
        />
        <button
          onClick={handleSendMessage}
          className="p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg ml-2 transition-colors disabled:opacity-50"
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <PaperAirplaneIconSVG className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default AIChatPage; 