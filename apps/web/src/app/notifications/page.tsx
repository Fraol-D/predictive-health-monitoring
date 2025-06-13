'use client';

import React from 'react';
import PageLayout from '@/components/layout/page-layout';
import Link from 'next/link';
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'alert' | 'update' | 'recommendation';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'alert',
    title: 'High Risk Alert: Hypertension',
    message: 'Your recent assessment indicates a high risk for hypertension. Please consult your doctor.',
    timestamp: '2023-10-28T10:05:00Z',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'recommendation',
    title: 'New Recommendation: Diet',
    message: 'A new dietary recommendation has been added based on your latest assessment.',
    timestamp: '2023-10-28T10:05:00Z',
    read: false,
  },
    {
    id: 'notif-3',
    type: 'update',
    title: 'Assessment Complete',
    message: 'Your health assessment from yesterday has been successfully processed.',
    timestamp: '2023-10-27T15:20:00Z',
    read: true,
  },
    {
    id: 'notif-4',
    type: 'recommendation',
    title: 'New Recommendation: Exercise',
    message: 'Check out your new personalized exercise plan to improve cardiovascular health.',
    timestamp: '2023-10-26T11:00:00Z',
    read: true,
  },
];


const notificationStyles = {
  alert: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/20' },
  update: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/20' },
  recommendation: { icon: Bell, color: 'text-sky-400', bg: 'bg-sky-900/20' },
};

const NotificationItem = ({ notif }: { notif: Notification }) => {
    const styles = notificationStyles[notif.type];
    const Icon = styles.icon;
    return (
        <div className={`p-4 rounded-lg flex items-start gap-4 transition-colors ${notif.read ? 'bg-card/50' : 'bg-card/80 backdrop-blur-md border border-primary/20'}`}>
            <div className={`p-2 rounded-full ${styles.bg}`}>
                <Icon className={`w-6 h-6 ${styles.color}`} />
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-foreground">{notif.title}</h3>
                <p className="text-muted-foreground text-sm">{notif.message}</p>
                 <p className="text-xs text-muted-foreground/80 mt-2">{new Date(notif.timestamp).toLocaleString()}</p>
            </div>
            {!notif.read && <div className="w-2.5 h-2.5 rounded-full bg-primary self-center mr-2"></div>}
        </div>
    );
};


export default function NotificationsPage() {
  return (
    <PageLayout>
      <header className="w-full mb-12">
        <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#C183FA] via-[#A259F7] via-[#D16BA5] to-[#EB499B]">Notifications</h2>
        <p className="text-xl text-muted-foreground">
          Stay updated with important alerts and health news.
        </p>
      </header>
       <div className="space-y-4">
        {mockNotifications.length > 0 ? (
          mockNotifications.map(notif => <NotificationItem key={notif.id} notif={notif} />)
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