'use client';

import React, { useState, useRef, useEffect } from 'react';
import PageLayout from '@/components/layout/page-layout';
import { Bot, User, Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';

// Define a message type
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const starterPrompts = [
  {
    icon: 'restaurant_menu',
    text: "Prepare me a meal plan",
  },
  {
    icon: 'fitness_center',
    text: "Give me a weekly exercise guide",
  },
  {
    icon: 'analytics_outlined',
    text: "Analyze my last assessment",
  },
  {
    icon: 'show_chart',
    text: "Show my health trends",
  },
];

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const isConversationStarted = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (prompt?: string) => {
    const messageToSend = prompt || input;
    if (messageToSend.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      text: messageToSend,
      sender: 'user',
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageToSend,
          history: messages // Sending history for context
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
      <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-4xl mx-auto">
        <div className={`flex-1 overflow-y-auto p-6 ${!isConversationStarted ? 'flex items-center justify-center' : ''}`}>
          {!isConversationStarted ? (
            <div className="text-center">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                    <Sparkles className="w-10 h-10 text-primary" />
                </div>
              <h1 className="text-3xl font-bold mb-2">AI Health Assistant</h1>
              <p className="text-muted-foreground mb-8">How can I help you today?</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {starterPrompts.map((prompt) => (
                   <Button
                    key={prompt.text}
                    variant="outline"
                    className="h-auto w-full text-left justify-start p-4"
                    onClick={() => handleSendMessage(prompt.text)}
                  >
                    <span className="text-xl mr-4">{prompt.icon}</span>
                    <span>{prompt.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
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
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                      </ReactMarkdown>
                    </div>
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
          )}
        </div>

        {/* Chat Input */}
        <div className={`w-full max-w-4xl mx-auto p-4 ${isConversationStarted ? 'sticky bottom-0 bg-background/80 backdrop-blur-md' : ''}`}>
           <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
                placeholder="Ask the AI Health Assistant..."
                className="w-full px-4 py-3 pr-16 rounded-lg bg-background/70 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-base resize-none"
                rows={1}
                disabled={isLoading}
              />
            <Button
              onClick={() => handleSendMessage()}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 p-0"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </Button>
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