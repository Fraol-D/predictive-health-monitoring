'use client';

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/page-layout';
import Link from 'next/link';
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../providers/auth-provider'; // Import useAuth

interface Notification {
  _id: string; // MongoDB _id
  notificationId: string; // Frontend generated UUID
  userId: string; // MongoDB User _id
  message: string;
  type: 'info' | 'warning' | 'alert' | 'recommendation' | 'system';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

const notificationStyles = {
  alert: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/20' },
  info: { icon: Bell, color: 'text-blue-400', bg: 'bg-blue-900/20' }, // Added info type
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-900/20' }, // Added warning type
  recommendation: { icon: Bell, color: 'text-primary', bg: 'bg-primary/20' },
  system: { icon: CheckCircle, color: 'text-gray-400', bg: 'bg-gray-700/20' }, // Added system type
};

const NotificationItem = ({ notif, onMarkAsRead }: { notif: Notification, onMarkAsRead: (id: string) => void }) => {
    const styles = notificationStyles[notif.type] || notificationStyles.info;
    const Icon = styles.icon;
    return (
        <div 
          className={`p-4 rounded-lg flex items-start gap-4 transition-colors relative group ${
            notif.isRead ? 'bg-card/50' : 'bg-card/80 backdrop-blur-md border border-primary/20'
          }`}
        >
            <div className={`p-2 rounded-full ${styles.bg}`}>
                <Icon className={`w-6 h-6 ${styles.color}`} />
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-foreground">{notif.type.charAt(0).toUpperCase() + notif.type.slice(1)} Notification</h3> {/* Use type as title for now */}
                <p className="text-muted-foreground text-sm">{notif.message}</p>
                 <p className="text-xs text-muted-foreground/80 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
            </div>
            {!notif.isRead && (
              <button
                onClick={() => onMarkAsRead(notif.notificationId)}
                className="absolute top-2 right-2 p-1 rounded-full bg-primary/20 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                title="Mark as Read"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
        </div>
    );
};


export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!user) {
      setIsLoading(false);
      setError('Please log in to view notifications.');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/notifications?userId=${user.uid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotifications(data);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Failed to fetch notifications: ${errorMessage}`);
      console.error("Error fetching notifications:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, firebaseUID: user.uid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Optimistically update UI
      setNotifications(prev => 
        prev.map(notif => 
          notif.notificationId === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error("Failed to mark notification as read:", errorMessage);
      alert(`Failed to mark notification as read: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading notifications...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-center py-16 bg-card/80 backdrop-blur-md rounded-xl shadow-lg border-2 border-dashed border-red-500">
          <h3 className="text-2xl font-semibold mb-4 text-red-500">Error Loading Notifications</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/profile">
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform">
              Go to Profile
            </button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <header className="w-full mb-12">
        <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Notifications</h2>
        <p className="text-xl text-muted-foreground">
          Stay updated with important alerts and health news.
        </p>
      </header>
       <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map(notif => <NotificationItem key={notif.notificationId} notif={notif} onMarkAsRead={handleMarkAsRead} />)
        ) : (
          <div className="text-center py-16 bg-card/50 rounded-xl">
             <h3 className="text-2xl font-semibold mb-4">No New Notifications</h3>
             <p className="text-muted-foreground">You're all caught up!</p>
           </div>
        )}
      </div>
    </PageLayout>
  );
} 