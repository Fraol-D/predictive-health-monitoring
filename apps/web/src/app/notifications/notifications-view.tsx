'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { BellIcon, CheckCircleIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react'; // Example icons

interface Notification {
  id: string;
  type: 'reminder' | 'alert' | 'update' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

const notificationIcons: Record<Notification['type'], React.ReactNode> = {
  reminder: <BellIcon className="w-5 h-5 text-blue-500" />,
  alert: <AlertTriangleIcon className="w-5 h-5 text-red-500" />,
  update: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
  info: <InfoIcon className="w-5 h-5 text-sky-500" />,
};

const NotificationsView = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data fetching for notifications
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setNotifications([
        {
          id: 'notif1',
          type: 'alert',
          title: 'High Risk Detected',
          message: 'Your recent assessment indicates a high risk for developing Type 2 Diabetes. Please review your report.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
          isRead: false,
          link: '/report/assessXYZ', // Example link to a report
        },
        {
          id: 'notif2',
          type: 'reminder',
          title: 'Follow-up Checkup',
          message: 'Reminder: Your scheduled virtual check-up with Dr. Smith is tomorrow at 10:00 AM.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), // 20 hours ago
          isRead: false,
        },
        {
          id: 'notif3',
          type: 'update',
          title: 'Profile Updated',
          message: 'Your dietary preferences have been successfully updated in your profile.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          isRead: true,
          link: '/profile',
        },
        {
          id: 'notif4',
          type: 'info',
          title: 'New Feature: AI Chat',
          message: 'You can now chat with our AI Health Assistant for quick insights and support!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
          isRead: true,
          link: '/chat',
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="mt-4 text-lg">Loading Notifications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8">
      {/* Navigation */}
      <nav className="w-full max-w-4xl mb-8 p-3 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Predictive Health
          </Link>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <BellIcon className="w-6 h-6 text-primary" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <ThemeToggleButton />
          </div>
        </div>
      </nav>

      <main className="w-full max-w-4xl space-y-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Notifications</h1>
          {notifications.length > 0 && unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-colors">
              Mark all as read
            </button>
          )}
        </header>

        {notifications.length === 0 ? (
          <div className="text-center p-10 bg-card rounded-xl shadow-md">
            <BellIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No notifications yet.</p>
            <p className="text-sm text-muted-foreground mt-1">We'll let you know when there's something new for you.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg shadow-md flex items-start space-x-3 transition-all duration-300 ease-in-out border ${notification.isRead ? 'bg-card/60 dark:bg-card/40 border-border/50 opacity-70' : 'bg-card hover:shadow-xl border-primary/30 dark:border-primary/50'}`}
              >
                <div className="mt-1 flex-shrink-0">{notificationIcons[notification.type]}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className={`font-semibold ${notification.isRead ? 'text-foreground/70' : 'text-foreground'}`}>{notification.title}</h3>
                    <span className="text-xs text-muted-foreground">{new Date(notification.timestamp).toLocaleTimeString([], {day: 'numeric', month:'short', hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className={`text-sm mt-1 ${notification.isRead ? 'text-muted-foreground' : 'text-foreground/90'}`}>{notification.message}</p>
                  <div className="mt-2 flex space-x-3 items-center">
                  {notification.link && (
                    <Link href={notification.link}>
                       <button className="px-3 py-1 text-xs rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors">
                        View Details
                      </button>
                    </Link>
                  )}
                  {!notification.isRead && (
                    <button 
                      onClick={() => markAsRead(notification.id)} 
                      className="px-3 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-500 transition-colors">
                      Mark as read
                    </button>
                  )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="w-full max-w-4xl mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Predictive Health Monitoring. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default NotificationsView; 