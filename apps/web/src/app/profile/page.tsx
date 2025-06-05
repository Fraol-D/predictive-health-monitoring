'use client';
import React from 'react';
import PageLayout from '@/components/layout/page-layout';
import { User, Settings, ShieldCheck, LogOut } from 'lucide-react';

const ProfilePage = () => {
  // Mock user data
  const user = {
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    joinDate: '2023-01-15',
  };

  return (
    <PageLayout>
      <header className="w-full mb-12">
        <h2 className="text-4xl font-bold mb-2">My Profile</h2>
        <p className="text-xl text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Panel: User Info */}
        <div className="md:col-span-1">
          <div className="bg-card/70 backdrop-blur-md p-6 rounded-xl shadow-lg text-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Member since {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        {/* Right Panel: Settings */}
        <div className="md:col-span-2">
          <div className="bg-card/70 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6">
            <h3 className="text-2xl font-semibold border-b border-border/20 pb-4">Account Settings</h3>
            
            <div className="space-y-4">
              <button className="w-full flex items-center text-left p-4 rounded-lg hover:bg-card transition-colors">
                <Settings className="w-5 h-5 mr-4" />
                <span>General Settings</span>
              </button>
              <button className="w-full flex items-center text-left p-4 rounded-lg hover:bg-card transition-colors">
                <ShieldCheck className="w-5 h-5 mr-4" />
                <span>Security & Password</span>
              </button>
               <button className="w-full flex items-center text-left p-4 rounded-lg hover:bg-card transition-colors">
                <LogOut className="w-5 h-5 mr-4 text-red-500" />
                <span className="text-red-500">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage; 