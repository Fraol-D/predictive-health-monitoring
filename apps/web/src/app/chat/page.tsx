'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Bot, User, Send, Loader2, Sparkles, ChevronLeft, Menu, Plus, MessageSquare, X, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { useAuth } from '../../providers/auth-provider'; // Import useAuth

// Define types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

interface ChatSession {
  _id?: string; // MongoDB _id
  id: string; // Frontend generated UUID
  userId: string; // Firebase UID initially, then MongoDB _id
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
  const { user } = useAuth(); // Get the current authenticated user

  // Memoize active chat messages
  const activeMessages = React.useMemo(() => {
    return activeChatId ? chats[activeChatId]?.messages ?? [] : [];
  }, [chats, activeChatId]);

  // --- CHAT MANAGEMENT ---
  const fetchChats = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/chat/user/${user.uid}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch chats: ${response.status}`);
      }
      const data = await response.json();
      const fetchedChats: Record<string, ChatSession> = {};
      data.forEach((chat: ChatSession) => {
        fetchedChats[chat.id] = chat; // Use frontend-generated `id` as key
      });
      setChats(fetchedChats);

      // Set active chat if none is active or if the previously active one exists
      if (!activeChatId && data.length > 0) {
        setActiveChatId(data[0].id); // Set the most recent chat as active
      } else if (activeChatId && !fetchedChats[activeChatId]) {
        // If previously active chat was deleted or doesn't exist, select the most recent one
        if (data.length > 0) {
          setActiveChatId(data[0].id);
        } else {
          setActiveChatId(null); // No chats, stay in new chat state
        }
      }

    } catch (error) {
      console.error("Failed to load chats:", error);
    }
  }, [user, activeChatId]);

  useEffect(() => {
    // Set sidebar state based on screen size
    const isMobile = window.innerWidth < 768;
    setSidebarOpen(!isMobile);

    // Fetch chats when user is available
    if (user) {
      fetchChats();
    }
  }, [user, fetchChats]);

  const createNewChat = useCallback(() => {
    setActiveChatId(null);
    setInput('');
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    textareaRef.current?.focus();
  }, []);

  const selectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
    setInput('');
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    textareaRef.current?.focus();
  }, []);

  const deleteChat = useCallback(async (chatId: string) => {
    if (!user) return; // User must be authenticated

    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-UID': user.uid, // Pass UID for authorization if needed in API route
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete chat: ${response.status}`);
      }
      
      // Remove the chat from local state
      setChats(prev => {
        const newChats = { ...prev };
        delete newChats[chatId];
        return newChats;
      });

      // If the deleted chat was the active one, select the most recent remaining chat or create a new one
      if (activeChatId === chatId) {
        const sortedRemainingChats = Object.values(chats).filter(c => c.id !== chatId).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        if (sortedRemainingChats.length > 0) {
          setActiveChatId(sortedRemainingChats[0].id);
        } else {
          createNewChat();
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert("Failed to delete chat. Please try again.");
    }
  }, [user, chats, activeChatId, createNewChat]);

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
    if (!user) {
      alert("Please log in to chat.");
      return;
    }

    const messageToSend = input.trim();
    if (messageToSend === '' || isLoading) return;

    let currentChatId = activeChatId;
    const userMessage: Message = { id: uuidv4(), text: messageToSend, sender: 'user', timestamp: Date.now() };
    let newChatTitle = '';

    // If it's a new chat, prepare for creation on backend
    if (!currentChatId) {
      currentChatId = uuidv4(); // Generate a new frontend UUID for the chat
      newChatTitle = messageToSend.substring(0, 30) + (messageToSend.length > 30 ? '...' : '');
      setChats(prev => ({
        ...prev,
        [currentChatId!]: {
          id: currentChatId!,
          userId: user.uid,
          title: newChatTitle,
          messages: [userMessage],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }));
      setActiveChatId(currentChatId);
    } else {
      // It's an existing chat, update local state immediately for responsiveness
      setChats(prev => {
        const chat = prev[currentChatId!];
        return {
          ...prev,
          [currentChatId!]: {
            ...chat,
            messages: [...chat.messages, userMessage],
            updatedAt: new Date().toISOString(),
          },
        };
      });
    }
    
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid, // Firebase UID
          chatId: currentChatId,
          title: newChatTitle, // Only relevant for new chats
          message: userMessage, // Send the full message object
          // For AI context, send relevant history, but not the full ChatSession object
          history: activeMessages.map(msg => ({ sender: msg.sender, text: msg.text })) 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse: Message = { id: uuidv4(), text: data.reply, sender: 'ai', timestamp: Date.now() };
      
      // Update local state with AI response and backend's full chat object
      setChats(prev => {
        const chat = prev[currentChatId!];
        return {
          ...prev,
          [currentChatId!]: {
            ...chat,
            messages: [...chat.messages, aiResponse],
            // Optionally, update chat title from backend if AI generated it
            title: data.title || chat.title,
            updatedAt: data.updatedAt || chat.updatedAt,
            _id: data._id || chat._id, // Store backend's MongoDB _id
          },
        };
      });

    } catch (error) {
      console.error("Failed to send message:", error);
      const errorResponse: Message = { id: uuidv4(), text: 'Sorry, I couldn\'t connect to the AI. Please try again.', sender: 'ai', timestamp: Date.now() };
      setChats(prev => {
        const chat = prev[currentChatId!];
        return {
          ...prev,
          [currentChatId!]: {
            ...chat,
            messages: [...chat.messages, errorResponse],
            updatedAt: new Date().toISOString(),
          },
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedChats = Object.values(chats).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const Sidebar = () => (
    <aside className={`fixed top-0 left-0 z-30 h-full flex flex-col bg-card transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-72`}>
      <div className="flex items-center justify-between p-4 h-16">
        <Link href="/" className="font-bold text-xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a13de0] to-[#ff5177]">
            Predictive Health
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={createNewChat}
          className="ml-2"
          title="New Chat"
        >
          <Plus className="w-5 h-5" />
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
                      This action cannot be undone. This will permanently delete your
                      chat session and remove its data from our servers.
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
      <main className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-16">
          {!activeChatId && !isLoading && Object.keys(chats).length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <Sparkles className="w-16 h-16 mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Start a new conversation</h2>
              <p>Type your first message to begin chatting with the AI Health Assistant.</p>
            </div>
          )}

          {activeMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'ai' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-xl p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
              </div>
              {message.sender === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-800 dark:text-gray-200 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-4 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div className="max-w-xl p-3 rounded-lg bg-secondary text-secondary-foreground animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
        <div className="border-t border-border p-4 bg-background">
          <div className="flex items-center space-x-2">
            <textarea
              ref={textareaRef}
              className="flex-1 p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none overflow-hidden"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || input.trim() === ''}>
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