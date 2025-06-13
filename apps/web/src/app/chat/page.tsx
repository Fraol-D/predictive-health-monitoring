'use client';

import React, { useState, useRef, useEffect } from 'react';
import PageLayout from '@/components/layout/page-layout';
import { Bot, User, Send, Loader2 } from 'lucide-react';

// Define a message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init-1', text: "Hello! I'm your AI Health Assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      text: input,
      sender: 'user',
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          history: messages 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: Date.now().toString() + '-ai',
        text: data.reply || 'Sorry, I encountered an issue. Please try again.',
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);

    } catch (error) {
      console.error("Failed to send message:", error);
      const errorResponse: Message = {
        id: Date.now().toString() + '-ai-error',
        text: 'Sorry, I couldn\'t connect to the AI. Please check the server and try again.',
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto w-full">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 p-6 bg-card/50 backdrop-blur-sm rounded-t-xl border border-border/20">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
              )}
              <div className={`max-w-[80%] p-4 rounded-xl shadow-md ${
                  message.sender === 'user'
                    ? 'bg-primary/90 text-primary-foreground rounded-br-none'
                    : 'bg-card/80 backdrop-blur-md text-foreground rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
               {message.sender === 'user' && (
                <div className="w-10 h-10 rounded-full bg-card/80 flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <User className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 justify-start">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
              <div className="max-w-[80%] p-4 rounded-xl shadow-md bg-card/80 backdrop-blur-md text-foreground rounded-bl-none flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            </div>
          )}
           <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-card/80 backdrop-blur-md rounded-b-xl border-t-0 border border-border/20">
          <div className="flex items-center gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask the AI Health Assistant..."
                className="w-full px-4 py-3 rounded-lg bg-background/70 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
                disabled={isLoading}
              />
            <button
              onClick={handleSendMessage}
              className="p-3 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg transform hover:scale-105"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
           <p className="text-xs text-muted-foreground mt-2 text-center">
              AI assistant is for informational purposes only. Always consult a healthcare professional for medical advice.
            </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default ChatPage; 