'use client';

import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/layout/page-layout';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { 
    CalendarDays, Edit3, User, Settings, ShieldCheck, 
    ChevronRight, LogOut, Bell, Palette, Languages, BookOpenCheck 
} from 'lucide-react';

const ProfilePage = () => {
  // Mock data - in a real app, this would come from a context or a hook
  const user = {
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    joinDate: '2023-01-15',
    preferences: {
        theme: 'System',
        receiveNotifications: true,
        language: 'English (US)',
    }
  };

  const pastAssessments = [
    { id: 'assess456', date: '2024-01-22', type: 'Diabetes Risk', riskLevel: 'Medium', reportLink: '/report/mockReportId002' },
    { id: 'assess123', date: '2023-11-05', type: 'General Wellness', riskLevel: 'Low', reportLink: '/report/mockReportId003' },
  ];

  const riskBadgeStyles: Record<string, string> = {
    High: 'bg-red-900/50 text-red-300 border border-red-500/50',
    Medium: 'bg-yellow-800/50 text-yellow-300 border border-yellow-500/50',
    Low: 'bg-green-900/50 text-green-300 border border-green-500/50',
  };

  return (
    <PageLayout>
        <header className="w-full mb-12">
            <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#C183FA] to-[#EB499B]">User Profile</h2>
            <p className="text-xl text-muted-foreground">
                Manage your account information and preferences.
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column - User Info and Actions */}
            <div className="lg:col-span-1 space-y-8">
                {/* User Info Card */}
                <section className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto flex items-center justify-center mb-4 border-2 border-primary/30">
                        <User className="w-12 h-12 text-primary" />
          </div>
                    <h3 className="text-2xl font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Member since {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </p>
        </section>

                {/* Actions Card */}
                <section className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 border-b border-border/20 pb-3">Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center text-left p-3 rounded-lg hover:bg-card transition-colors">
                            <Edit3 className="w-5 h-5 mr-4 text-primary" />
                            <span>Edit Profile</span>
            </button>
                        <button className="w-full flex items-center text-left p-3 rounded-lg hover:bg-card transition-colors">
                            <ShieldCheck className="w-5 h-5 mr-4 text-primary" />
                            <span>Security & Password</span>
            </button>
                        <button className="w-full flex items-center text-left p-3 rounded-lg hover:bg-card transition-colors">
                            <LogOut className="w-5 h-5 mr-4 text-red-500" />
                            <span className="text-red-500">Log Out</span>
            </button>
          </div>
        </section>
            </div>

            {/* Right Column - Assessments and Settings */}
            <div className="lg:col-span-2 space-y-8">
                {/* Past Assessments Section */}
                <section className='bg-card/80 backdrop-blur-md rounded-xl shadow-lg'>
                    <header className="p-6 flex justify-between items-center border-b border-border/20">
                        <h2 className='text-2xl font-semibold flex items-center'>
                            <CalendarDays className='w-6 h-6 text-primary mr-3' /> Past Assessments
                        </h2>
                        {pastAssessments.length > 0 && (
                             <Link href='/history' className='text-sm text-primary hover:underline flex items-center'>
                                View All <ChevronRight className='w-4 h-4 ml-1' />
                            </Link>
                        )}
                    </header>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-left'>
                            <tbody>
                                {pastAssessments.length > 0 ? (
                                pastAssessments.map((assessment) => (
                                    <tr key={assessment.id} className="border-b border-border/20 last:border-b-0 hover:bg-card/50 transition-colors">
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <div className="font-semibold">{assessment.type}</div>
                                            <div className="text-sm text-muted-foreground">{new Date(assessment.date).toLocaleDateString()}</div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-center'>
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${riskBadgeStyles[assessment.riskLevel]}`}>
                                            {assessment.riskLevel}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-right'>
                                            <Link href={assessment.reportLink} className='text-primary hover:underline inline-flex items-center text-xs font-semibold'>
                                                <BookOpenCheck className="w-4 h-4 mr-1.5"/> View Report
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                                ) : (
                                <tr>
                                    <td colSpan={3} className='p-8 text-center text-muted-foreground'>No past assessments found.</td>
                                </tr>
                                )}
                            </tbody>
                        </table>
          </div>
        </section>

                {/* Settings Section */}
                <section className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
                     <h2 className='text-2xl font-semibold mb-4 flex items-center border-b border-border/20 pb-4'>
                        <Settings className='w-6 h-6 text-primary mr-3' /> App Settings
            </h2>
                    <div className='space-y-6'>
                        <div className='flex items-center justify-between'>
                            <div className="flex items-center">
                                <Palette className="w-5 h-5 mr-4 text-muted-foreground"/>
              <div>
                                    <h3 className='text-lg font-medium'>Theme</h3>
                                    <p className='text-sm text-muted-foreground'>Current: {user.preferences.theme}</p>
              </div>
              </div>
                            <ThemeToggleButton />
              </div>
                         <div className='flex items-center justify-between'>
                            <div className="flex items-center">
                                <Bell className="w-5 h-5 mr-4 text-muted-foreground"/>
              <div>
                                    <h3 className='text-lg font-medium'>Notifications</h3>
                                    <p className='text-sm text-muted-foreground'>{user.preferences.receiveNotifications ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
                            <button className="px-4 py-1.5 text-sm border rounded-md transition-colors disabled:opacity-50">
                                Toggle
                            </button>
              </div>
                        <div className='flex items-center justify-between'>
                             <div className="flex items-center">
                                <Languages className="w-5 h-5 mr-4 text-muted-foreground"/>
              <div>
                                    <h3 className='text-lg font-medium'>Language</h3>
                                    <p className='text-sm text-muted-foreground'>Current: {user.preferences.language}</p>
              </div>
            </div>
                            <button className="px-4 py-1.5 text-sm border rounded-md transition-colors disabled:opacity-50" disabled>
                                Change
                            </button>
              </div>
            </div>
          </section>
            </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage; 