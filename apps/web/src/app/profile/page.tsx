'use client';
import React from 'react';
import PageLayout from '@/components/layout/page-layout';
import { ShieldCheck } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

const ProfilePage = () => {
  // TODO: Replace with actual data from API
  const [profile, setProfile] = React.useState<UserProfile>({
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    height: 170,
    weight: 70,
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1234567890',
    },
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'en',
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfile((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof Pick<UserProfile, 'emergencyContact' | 'preferences'>],
          [field]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update profile
    console.log('Profile updated:', profile);
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Profile Header */}
        <header className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent pb-2">
            {profile.name}
          </h1>
          <p className="text-muted-foreground mt-2">{profile.email}</p>
        </header>

        {/* Profile Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card/70 dark:bg-card/60 backdrop-blur-md p-6 rounded-xl shadow-xl text-center transform transition-all hover:scale-105 hover:shadow-primary/20">
            <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
            <p className="text-2xl font-semibold mt-1 text-foreground">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="bg-card/70 dark:bg-card/60 backdrop-blur-md p-6 rounded-xl shadow-xl text-center transform transition-all hover:scale-105 hover:shadow-accent/20">
            <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
            <p className="text-2xl font-semibold mt-1 text-foreground capitalize">{profile.gender}</p>
          </div>
          <div className="bg-card/70 dark:bg-card/60 backdrop-blur-md p-6 rounded-xl shadow-xl text-center transform transition-all hover:scale-105 hover:shadow-primary/20">
            <h3 className="text-sm font-medium text-muted-foreground">Height</h3>
            <p className="text-2xl font-semibold mt-1 text-foreground">{profile.height} cm</p>
          </div>
          <div className="bg-card/70 dark:bg-card/60 backdrop-blur-md p-6 rounded-xl shadow-xl text-center transform transition-all hover:scale-105 hover:shadow-accent/20">
            <h3 className="text-sm font-medium text-muted-foreground">Weight</h3>
            <p className="text-2xl font-semibold mt-1 text-foreground">{profile.weight} kg</p>
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

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Personal Information Section */}
          <section className="bg-card/70 dark:bg-card/60 backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-muted-foreground mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-muted-foreground mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-muted-foreground mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  id="height"
                  value={profile.height}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-muted-foreground mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  value={profile.weight}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Emergency Contact Section */}
          <section className="bg-card/70 dark:bg-card/60 backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Emergency Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="emergencyContact.name" className="block text-sm font-medium text-muted-foreground mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  id="emergencyContact.name"
                  value={profile.emergencyContact.name}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label htmlFor="emergencyContact.relationship" className="block text-sm font-medium text-muted-foreground mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  name="emergencyContact.relationship"
                  id="emergencyContact.relationship"
                  value={profile.emergencyContact.relationship}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="emergencyContact.phone" className="block text-sm font-medium text-muted-foreground mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="emergencyContact.phone"
                  id="emergencyContact.phone"
                  value={profile.emergencyContact.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-card/70 dark:bg-card/60 backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Preferences
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label htmlFor="preferences.notifications" className="font-medium text-foreground">
                  Enable Notifications
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="preferences.notifications" 
                    id="preferences.notifications"
                    checked={profile.preferences.notifications}
                    onChange={handleInputChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div>
                <label htmlFor="preferences.language" className="block text-sm font-medium text-muted-foreground mb-1">
                  Language
                </label>
                <select
                  name="preferences.language"
                  id="preferences.language"
                  value={profile.preferences.language}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </section>
          
          {/* Account Settings & Data Sharing - simplified for now, keeping the structure */}
          <section className="bg-card/70 dark:bg-card/60 backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-pink-400">
              Account Management
            </h2>
            <div className="space-y-4">
               <button type="button" className="w-full px-4 py-3 text-left rounded-lg bg-background/50 hover:bg-primary/10 text-foreground transition-colors font-medium">Change Password</button>
               <button type="button" className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-500/10 rounded-lg bg-background/50 transition-colors font-medium">Delete Account</button>
            </div>
          </section>

          <section className="bg-card/70 dark:bg-card/60 backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-teal-400">
              Data Sharing Preferences
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Share with Healthcare Providers</h3>
                  <p className="text-sm text-muted-foreground">Allow medical professionals to access your health data.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" /> {/* TODO: Connect to state */}
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Anonymous Data Collection</h3>
                  <p className="text-sm text-muted-foreground">Help improve our AI models with anonymous data.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" /> {/* TODO: Connect to state */}
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          <div className="flex justify-end mt-10">
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default ProfilePage; 