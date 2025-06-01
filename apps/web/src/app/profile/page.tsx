import React from 'react';
import PageLayout from '@/components/layout/page-layout';
import { ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  // Mock user data - will be replaced with actual user data from backend
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 2024',
    lastAssessment: '2 days ago',
    totalAssessments: 3,
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Profile Header */}
        <header className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            {user.name}
          </h1>
          <p className="text-muted-foreground mt-2">{user.email}</p>
        </header>

        {/* Profile Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
            <p className="text-2xl font-semibold mt-1">{user.joinDate}</p>
          </div>
          <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Last Assessment</h3>
            <p className="text-2xl font-semibold mt-1">{user.lastAssessment}</p>
          </div>
          <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Total Assessments</h3>
            <p className="text-2xl font-semibold mt-1">{user.totalAssessments}</p>
          </div>
        </section>

        {/* Profile Actions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Account Settings</h2>
          <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-4">
            <button className="w-full px-4 py-2 text-left rounded-lg hover:bg-primary/10 transition-colors">
              Edit Profile
            </button>
            <button className="w-full px-4 py-2 text-left rounded-lg hover:bg-primary/10 transition-colors">
              Change Password
            </button>
            <button className="w-full px-4 py-2 text-left rounded-lg hover:bg-primary/10 transition-colors">
              Notification Preferences
            </button>
            <button className="w-full px-4 py-2 text-left text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
              Delete Account
            </button>
          </div>
        </section>

        {/* Data Sharing Settings */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Sharing</h2>
          <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Share with Healthcare Providers</h3>
                <p className="text-sm text-muted-foreground">Allow medical professionals to access your health data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Anonymous Data Collection</h3>
                <p className="text-sm text-muted-foreground">Help improve our AI models with anonymous data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default ProfilePage; 