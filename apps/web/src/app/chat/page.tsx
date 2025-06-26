'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Bot, User, Send, Loader2, Sparkles, ChevronLeft, Menu, Plus, MessageSquare, X, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

// Define types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

const ChatPage = () => {
  const [chats, setChats] = useState<Record<string, ChatSession>>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Memoize active chat messages
  const activeMessages = React.useMemo(() => {
    return activeChatId ? chats[activeChatId]?.messages ?? [] : [];
  }, [chats, activeChatId]);

  // --- LOCAL STORAGE & CHAT MANAGEMENT ---
  useEffect(() => {
    try {
      // Set sidebar state based on screen size
      const isMobile = window.innerWidth < 768;
      setSidebarOpen(!isMobile);

      const savedChats = localStorage.getItem('chatHistory');
      if (savedChats) {
        setChats(JSON.parse(savedChats));
      }
      const lastActiveId = localStorage.getItem('activeChatId');
      if (lastActiveId) {
        setActiveChatId(lastActiveId);
      }
    } catch (error) {
      console.error("Failed to load chats from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      if (Object.keys(chats).length > 0) {
        localStorage.setItem('chatHistory', JSON.stringify(chats));
      }
      if (activeChatId) {
        localStorage.setItem('activeChatId', activeChatId);
      }
    } catch (error) {
       console.error("Failed to save chats to localStorage", error);
    }
  }, [chats, activeChatId]);

  const createNewChat = useCallback(() => {
    setActiveChatId(null);
    setInput('');
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    textareaRef.current?.focus();
  }, []);

  const handleDeleteChat = useCallback((chatId: string) => {
    if (!chatId) return;
    
    if (window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      setChats(prev => {
        const newChats = { ...prev };
        delete newChats[chatId];
        // Also update localStorage right away
        localStorage.setItem('chatHistory', JSON.stringify(newChats));
        return newChats;
      });
      
      // If the deleted chat was the active one, reset to the new chat screen
      if (activeChatId === chatId) {
        setActiveChatId(null);
        localStorage.removeItem('activeChatId');
      }
    }
  }, [activeChatId]);

  useEffect(() => {
    const sortedChats = Object.values(chats).sort((a, b) => b.timestamp - a.timestamp);
    // If there are no chats after loading, stay in the 'new chat' state (activeChatId is null).
    if (!activeChatId && sortedChats.length > 0 && !localStorage.getItem('activeChatId')) {
      setActiveChatId(sortedChats[0].id);
    }
  }, [activeChatId, chats]);

  // --- UI & SCROLL LOGIC ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200; // approx 8 lines
      if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [input]);

  const handleSendMessage = async () => {
    const messageToSend = input.trim();
    if (messageToSend === '' || isLoading) return;

    let currentChatId = activeChatId;
    const userMessage: Message = { id: uuidv4(), text: messageToSend, sender: 'user' };
    
    // If it's a new chat, create it first
    if (!currentChatId) {
      const newChatId = uuidv4();
      const newChat: ChatSession = {
        id: newChatId,
        title: messageToSend.substring(0, 30),
        messages: [userMessage],
        timestamp: Date.now(),
      };
      setChats(prev => ({ ...prev, [newChatId]: newChat }));
      setActiveChatId(newChatId);
      currentChatId = newChatId;
    } else {
      // It's an existing chat
      const updatedMessages = [...(chats[currentChatId]?.messages ?? []), userMessage];
      const updatedChat = { ...chats[currentChatId], messages: updatedMessages };
      setChats(prev => ({ ...prev, [currentChatId!]: updatedChat }));
    }
    
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageToSend, 
          // Sending only previous messages for history context
          history: chats[currentChatId]?.messages ?? [] 
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const aiResponse: Message = { id: uuidv4(), text: data.reply, sender: 'ai' };
      
      setChats(prev => {
        const chat = prev[currentChatId!];
        return {
          ...prev,
          [currentChatId!]: {
            ...chat,
            messages: [...chat.messages, aiResponse],
          },
        };
      });

    } catch (error) {
      console.error("Failed to send message:", error);
      const errorResponse: Message = { id: uuidv4(), text: 'Sorry, I couldn\'t connect to the AI. Please try again.', sender: 'ai' };
      setChats(prev => {
        const chat = prev[currentChatId!];
        return {
          ...prev,
          [currentChatId!]: {
            ...chat,
            messages: [...chat.messages, errorResponse],
          },
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedChats = Object.values(chats).sort((a, b) => b.timestamp - a.timestamp);

  const Sidebar = () => (
    <aside className={`fixed top-0 left-0 z-30 h-full flex flex-col bg-card transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-72`}>
      <div className="flex items-center justify-between p-4 h-16">
        <Link href="/" className="font-bold text-xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a13de0] to-[#ff5177]">
            Predictive Health
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto sidebar-scroll-container">
        <nav className="p-2 space-y-1">
          {sortedChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => { setActiveChatId(chat.id); if (window.innerWidth < 768) setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md text-sm transition-colors relative ${
                activeChatId === chat.id ? 'bg-muted text-foreground' : 'hover:bg-muted/50'
              }`}
            >
              {activeChatId === chat.id && (
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#a13de0] to-[#ff5177] rounded-r-full"></div>
              )}
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate flex-1">{chat.title}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <div className="h-px w-10/12 mx-auto bg-white/10" />
        <Link href="/profile" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors mt-2">
          <User className="w-5 h-5" />
          <span className="text-sm">Profile</span>
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 z-40 p-2 rounded-full flex items-center justify-center bg-gradient-to-br from-[#a13de0] to-[#ff5177] text-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
          style={{ left: isSidebarOpen ? 'calc(18rem - 24px)' : '1rem' }}
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      <Sidebar />
      <div className={`flex flex-col flex-1 h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-72' : ''}`}>
        {/* Header */}
        <header className="flex items-center justify-end h-16 px-4 gap-2">
          {activeChatId && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDeleteChat(activeChatId)}
              className="h-9 w-9 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              aria-label="Delete Chat"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
          <Button
            size="icon"
            onClick={createNewChat}
            className="h-9 w-9 rounded-full bg-gradient-to-br from-[#a13de0] to-[#ff5177] text-white hover:scale-105 active:scale-95 transition-transform"
          >
             <span className="sr-only">New Chat</span>
            <Plus className="w-5 h-5" />
          </Button>
        </header>
        
        {/* Main chat area */}
        <main className="flex-1 overflow-y-auto pb-32">
          <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {activeMessages.length === 0 && !isLoading ? (
              <div className="text-center pt-16">
                  <div className="inline-block p-4 bg-gradient-to-br from-[#a13de0]/10 to-[#ff5177]/10 rounded-full mb-4">
                     <Sparkles className="w-10 h-10 text-transparent bg-clip-text bg-gradient-to-br from-[#a13de0] to-[#ff5177]" />
                   </div>
                  <h1 className="text-3xl font-bold mb-2">AI Health Assistant</h1>
                  <p className="text-muted-foreground mb-8">How can I help you today?</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeMessages.map((message) => (
                  <div key={message.id} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.sender === 'ai' && <div className="w-10 h-10 rounded-full bg-[#a13de0]/20 flex items-center justify-center text-[#a13de0] shrink-0"><Bot className="w-6 h-6" /></div>}
                    <div className={`max-w-[85%] p-4 rounded-xl shadow-sm ${message.sender === 'user' ? 'bg-gradient-to-br from-[#a13de0] to-[#ff5177] text-white rounded-br-none' : 'bg-card text-card-foreground rounded-bl-none'}`}>
                      <div className="prose prose-sm dark:prose-invert max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown></div>
                </div>
                    {message.sender === 'user' && <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground shrink-0"><User className="w-6 h-6" /></div>}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 justify-start">
                    <div className="w-10 h-10 rounded-full bg-[#a13de0]/20 flex items-center justify-center text-[#a13de0] shrink-0"><Bot className="w-6 h-6" /></div>
                    <div className="max-w-[85%] p-4 rounded-xl shadow-sm bg-card text-card-foreground rounded-bl-none flex items-center space-x-2"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm text-muted-foreground">AI is thinking...</span></div>
            </div>
          )}
           <div ref={messagesEndRef} />
        </div>
            )}
          </div>
        </main>

        {/* Chat Input Footer */}
        <footer className="w-full bg-background/80 backdrop-blur-md z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex w-full items-end py-2">
                <textarea
                  ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="Type your health question..."
                  className="w-full pl-4 pr-14 py-3 rounded-xl bg-muted/80 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a13de0]/60 text-base resize-none leading-6"
                  rows={1}
                disabled={isLoading}
              />
              <div className="absolute right-2.5 bottom-2.5">
                <Button onClick={() => handleSendMessage()} size="icon" className="h-9 w-9 p-0 rounded-full flex items-center justify-center bg-gradient-to-br from-[#a13de0] to-[#ff5177] text-white shadow-md hover:scale-105 active:scale-95 transition-transform" disabled={!input.trim() || isLoading}>
                  <span className="sr-only">Send Message</span>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage; 