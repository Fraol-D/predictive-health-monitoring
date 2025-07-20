
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Bot, User, Send, Loader2, Sparkles, Menu, Plus, MessageSquare, X, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from '../../providers/auth-provider';

// Define types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

interface ChatSession {
  _id?: string; // MongoDB _id
  id: string;    // Frontend generated UUID (corresponds to chatId in backend)
  userId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const ChatPage = () => {
  const [chats, setChats] = useState<Record<string, ChatSession>>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  
  const activeMessages = React.useMemo(() => {
    return activeChatId ? chats[activeChatId]?.messages ?? [] : [];
  }, [chats, activeChatId]);

  // --- CHAT MANAGEMENT ---
  const fetchChats = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/chat?userId=${user.uid}`);
      if (!response.ok) throw new Error(`Failed to fetch chats: ${response.status}`);
      
      const data: any[] = await response.json();

      const fetchedChats: Record<string, ChatSession> = {};
      data.forEach((chat) => {
        fetchedChats[chat.chatId] = {
          ...chat,
          id: chat.chatId, // Ensure frontend ID is the persistent chatId
          messages: chat.messages.map((msg: any) => ({
            id: msg._id || uuidv4(),
            sender: msg.role,
            text: msg.content,
            timestamp: new Date(msg.timestamp).getTime(),
          })),
        };
      });
      setChats(fetchedChats);
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  }, [user]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setSidebarOpen(!isMobile);
    if (user) {
      fetchChats();
    } else {
      setChats({});
      setActiveChatId(null);
    }
  }, [user, fetchChats]);

  const createNewChat = useCallback(() => {
    setActiveChatId(null);
    setInput('');
    if (window.innerWidth < 768) setSidebarOpen(false);
    textareaRef.current?.focus();
  }, []);

  const selectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
    setInput('');
    if (window.innerWidth < 768) setSidebarOpen(false);
    textareaRef.current?.focus();
  }, []);

  const deleteChat = useCallback(async (chatId: string) => {
    if (!user) return;

    const originalChats = { ...chats };
    
    // Optimistic deletion
    const newChats = { ...chats };
    delete newChats[chatId];
    setChats(newChats);
    if (activeChatId === chatId) {
        setActiveChatId(null);
    }

    try {
      // Get MongoDB user ID
      const { getOrCreateMongoUserId } = await import('@/lib/auth-service');
      const mongoUserId = await getOrCreateMongoUserId(user.uid);
      
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: mongoUserId }),
      });

      if (!response.ok) {
        // Revert on failure
        setChats(originalChats);
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete chat: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert("Failed to delete chat. Please try again.");
      setChats(originalChats); // Revert on failure
    }
  }, [user, chats, activeChatId]);

  const handleSendMessage = async () => {
    if (!user) {
      alert("Please log in to chat.");
      return;
    }

    const messageToSend = input.trim();
    if (messageToSend === '' || isLoading) return;

    const isNewChat = activeChatId === null;
    const tempChatId = isNewChat ? uuidv4() : activeChatId;
    
    const userMessage: Message = { 
      id: uuidv4(), 
      text: messageToSend, 
      sender: 'user', 
      timestamp: Date.now() 
    };

    // --- Optimistic UI Update ---
    if (isNewChat) {
      setChats(prev => ({
        ...prev,
        [tempChatId]: {
          id: tempChatId,
          userId: user.uid,
          title: messageToSend.substring(0, 40) + '...',
          messages: [userMessage],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }));
      setActiveChatId(tempChatId);
    } else {
      setChats(prev => ({
        ...prev,
        [tempChatId]: {
          ...prev[tempChatId],
          messages: [...prev[tempChatId].messages, userMessage],
          updatedAt: new Date().toISOString(),
        },
      }));
    }
    
    setInput('');
    setIsLoading(true);

    try {
      // --- API Call ---
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          chatId: tempChatId,
          title: isNewChat ? messageToSend.substring(0, 40) + '...' : undefined,
          message: { role: 'user', content: userMessage.text, timestamp: userMessage.timestamp },
          history: activeMessages.map(msg => ({ sender: msg.sender, text: msg.text }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse: Message = { id: uuidv4(), text: data.reply, sender: 'ai', timestamp: Date.now() };
      
      // --- Final State Update ---
      setChats(prev => {
        const currentChat = prev[tempChatId];
        return {
          ...prev,
          [tempChatId]: {
            ...currentChat,
            title: data.title || currentChat.title,
            messages: [...currentChat.messages, aiResponse],
            _id: data._id || currentChat._id,
            updatedAt: data.updatedAt || currentChat.updatedAt,
          },
        };
      });

    } catch (error) {
      console.error("Failed to send message:", error);
      setChats(prev => {
        const chat = prev[tempChatId];
        if (!chat) return prev;
        return {
          ...prev,
          [tempChatId]: {
            ...chat,
            messages: [...chat.messages, { id: uuidv4(), text: 'Sorry, an error occurred. Please try again.', sender: 'ai', timestamp: Date.now() }],
          },
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const sortedChats = Object.values(chats).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const Sidebar = () => (
    <aside className={`fixed top-0 left-0 z-30 h-full flex flex-col bg-card transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-72`}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-border">
        <Link href="/" className="font-bold text-xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a13de0] to-[#ff5177]">
            Predictive Health
          </span>
        </Link>
            <Button onClick={createNewChat} variant="ghost" size="icon" className="md:hidden">
                <Plus className="w-5 h-5"/>
            </Button>
        </div>
        <div className="p-2">
             <Button onClick={createNewChat} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:from-purple-600 hover:to-pink-600">
                <Plus className="w-5 h-5 mr-2"/>
                New Chat
            </Button>
      </div>
      <div className="flex-1 overflow-y-auto sidebar-scroll-container">
        <nav className="p-2 space-y-1">
          {sortedChats.map((chat) => (
            <div key={chat.id} className="group relative">
            <button
                onClick={() => selectChat(chat.id)}
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this chat session.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteChat(chat.id)} className="bg-red-500 hover:bg-red-600">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <div className="mx-4 mb-4 border-t border-gray-300/40 dark:border-gray-600/40"></div>
        <Link href="/profile" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors mt-2">
          <User className="w-5 h-5" />
          <span className="text-sm">Profile</span>
        </Link>
      </div>
    </aside>
  );

  const startupPrompts = [
    { title: "Plan a healthy meal", prompt: "I want to eat healthier. Can you help me plan a balanced meal for today?" },
    { title: "Explain a health concept", prompt: "What is metabolic syndrome and what are the risk factors?" },
    { title: "Suggest a workout", prompt: "I have 30 minutes for a workout at home with no equipment. What do you suggest?" },
    { title: "Understand my results", prompt: "My blood pressure was 130/85. What does this mean?" },
  ];

  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 z-40 p-2 rounded-full flex items-center justify-center bg-gradient-to-br from-[#a13de0] to-[#ff5177] text-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
          style={{ left: isSidebarOpen ? 'calc(18rem + 8px)' : '1rem' }}
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      <Sidebar />
      <main className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeChatId === null ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <Sparkles className="w-16 h-16 mb-4 text-purple-400" />
              <h2 className="text-2xl font-semibold mb-2 text-foreground">AI Health Assistant</h2>
              <p className="max-w-md">How can I help you today? Select a prompt below or type your own message.</p>
              <div className="w-full max-w-3xl mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {startupPrompts.map((item, index) => (
                <Button
                      key={index}
                      variant="outline"
                      className="text-left h-auto py-3 px-4 border-input bg-card/60 hover:bg-card/90 transition-colors duration-200 flex flex-col items-start w-full md:max-w-sm !whitespace-normal"
                     onClick={() => {
                        setInput(item.prompt);
                        textareaRef.current?.focus();
                      }}
                    >
                      <div className="w-full">
                        <p className="font-semibold text-foreground mb-1 break-words whitespace-normal">{item.title}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-normal">{item.prompt}</p>
                      </div>
          </Button>
                  ))}
                </div>
                   </div>
              </div>
            ) : (
            <>
                {activeMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'ai' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-2xl p-3 rounded-xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                  </div>
                  {message.sender === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                      <User className="w-4 h-4" />
                </div>
                  )}
            </div>
          ))}
            </>
          )}

          {isLoading && (
            <div className="flex items-start gap-4 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div className="max-w-xl p-3 rounded-lg bg-secondary text-secondary-foreground flex items-center">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}

           <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-background">
          <div className="mx-4 mb-4 border-t border-gray-300/40 dark:border-gray-600/40"></div>
          <div className="relative flex items-center">
                <textarea
                  ref={textareaRef}
              className="w-full p-3 pr-20 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none overflow-hidden"
              placeholder="Ask about your health, plan a meal, or get fitness advice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
                  rows={1}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || input.trim() === ''} className="absolute right-2 top-1/2 -translate-y-1/2" size="icon">
              <Send className="w-5 h-5" />
              <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
      </main>
    </div>
  );
};

export default ChatPage; 