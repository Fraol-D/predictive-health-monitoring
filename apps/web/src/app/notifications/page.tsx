'use client';

import React from 'react';
import PageLayout from '@/components/layout/page-layout';
import { Bell, BellOff } from 'lucide-react';

interface Notification {
  id: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

const NotificationsPage = () => {
  // Mock data - in a real app, this would be dynamic
  const notifications: Notification[] = []; // Start with an empty array to show the empty state

  return (
    <PageLayout>
      <header className="w-full mb-12 flex justify-between items-center">
        <div>
            <h2 className="text-4xl font-bold mb-2">Notifications</h2>
            <p className="text-xl text-muted-foreground">
            Your recent alerts and updates will appear here.
            </p>
        </div>
        <button className="p-3 rounded-lg hover:bg-card transition-colors">
            <Bell className="w-6 h-6" />
        </button>
      </header>

      <div className="max-w-4xl mx-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-24 bg-card/50 rounded-xl shadow-lg">
            <div className="w-24 h-24 rounded-full bg-card mx-auto flex items-center justify-center mb-6">
                <BellOff className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No New Notifications</h3>
            <p className="text-muted-foreground">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* This is where you would map over notifications */}
            {/* Example item: */}
            {/* <div className="bg-card/70 p-4 rounded-lg flex items-center"> ... </div> */}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default NotificationsPage; 