'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { BookOpenCheck, CalendarDays, Edit3, UserCircle, Settings, ShieldCheck, TrendingUp } from 'lucide-react';

// Mock data structures
interface UserProfile {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  avatarUrl?: string; // Optional: URL to user's avatar image
  preferences?: {
    language: string;
    receiveNotifications: boolean;
    theme: string; // Added theme
  };
}

interface PastAssessment {
  id: string;
  date: string;
  type: string; // e.g., 'General Health', 'Diabetes Risk'
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
  isSharedWithProfessional: boolean;
  reportLink: string;
}

const riskColors: Record<string, string> = {
  Low: 'text-green-600 dark:text-green-400',
  Medium: 'text-yellow-600 dark:text-yellow-400',
  High: 'text-red-600 dark:text-red-400',
};

const UserProfileView = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pastAssessments, setPastAssessments] = useState<PastAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedAssessmentForSharing, setSelectedAssessmentForSharing] = useState<PastAssessment | null>(null);

  // Mock data fetching
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: 'user123',
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        memberSince: '2023-05-15',
        avatarUrl: 'https://via.placeholder.com/150/92C950/FFFFFF?text=AJ', // Placeholder avatar
        preferences: {
          language: 'en',
          receiveNotifications: true,
          theme: 'System', // Added theme to mock data
        },
      });
      setPastAssessments([
        { id: 'assess789', date: '2024-03-10', type: 'Heart Health', riskLevel: 'Low', riskScore: 35, isSharedWithProfessional: true, reportLink: '/report/mockReportId001' },
        { id: 'assess456', date: '2024-01-22', type: 'Diabetes Risk', riskLevel: 'Medium', riskScore: 62, isSharedWithProfessional: false, reportLink: '/report/mockReportId002' },
        { id: 'assess123', date: '2023-11-05', type: 'General Wellness', riskLevel: 'Low', riskScore: 28, isSharedWithProfessional: false, reportLink: '/report/mockReportId003' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleShareClick = (assessment: PastAssessment) => {
    if (assessment.isSharedWithProfessional) {
      alert('This assessment has already been shared.');
      return;
    }
    setSelectedAssessmentForSharing(assessment);
    setShowConsentModal(true);
  };

  const handleShareConsent = async (consentGiven: boolean) => {
    setShowConsentModal(false);
    if (consentGiven && selectedAssessmentForSharing) {
      console.log(`User consented to share assessment: ${selectedAssessmentForSharing.id}`);
      // Mock API call to update sharing status
      try {
        const response = await fetch(`/api/report/${selectedAssessmentForSharing.id}/share`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sharedWith: user?.email || 'professional@example.com', method: 'user_profile_share' }),
        });
        if (!response.ok) throw new Error('Failed to share report');
        
        // Update UI optimistically
        setPastAssessments(prevAssessments => 
          prevAssessments.map(asm => 
            asm.id === selectedAssessmentForSharing.id ? { ...asm, isSharedWithProfessional: true } : asm
          )
        );
        alert('Assessment will be shared.');
      } catch (error) {
        console.error('Error sharing assessment:', error);
        alert('Failed to share assessment. Please try again.');
      }
    }
    setSelectedAssessmentForSharing(null);
  };

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary'></div>
        <p className='mt-4 text-lg'>Loading Profile...</p>
      </div>
    );
  }

  if (!user) {
    // This case should ideally not happen if auth is in place and redirects unauth users
    return <div className='min-h-screen flex items-center justify-center'><p>User not found. Please <Link href='/auth/login'><span className='text-primary hover:underline'>login</span></Link>.</p></div>;
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Header/Navigation (Assuming a similar layout to other pages) */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-14 items-center'>
          <Link href='/' className='mr-6 flex items-center space-x-2'>
            <ShieldCheck className='h-6 w-6 text-primary' />
            <span className='font-bold sm:inline-block'>PHM</span>
          </Link>
          <nav className='flex flex-1 items-center space-x-4 lg:space-x-6'>
            <Link href='/assessment' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
              Assessment
            </Link>
            <Link href='/report/mockReportId123' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
              Reports
            </Link>
            <Link href='/recommendations' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
              Recommendations
            </Link>
            <Link href='/profile' className='text-sm font-medium text-primary underline'>
              Profile
            </Link>
            <Link href='/notifications' className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
              Notifications
            </Link>
          </nav>
          <ThemeToggleButton />
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-8 text-primary'>User Profile</h1>

        {/* User Information Section */}
        <section className='mb-12 p-6 bg-card rounded-lg shadow-md'>
          <div className='flex items-center mb-6'>
            <UserCircle className='h-16 w-16 text-primary mr-4' />
            <div>
              <h2 className='text-2xl font-semibold'>{user.name}</h2>
              <p className='text-muted-foreground'>{user.email}</p>
              <p className='text-sm text-muted-foreground'>Member since: {new Date(user.memberSince).toLocaleDateString()}</p>
            </div>
            <button className='ml-auto px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 flex items-center'>
              <Edit3 className='h-4 w-4 mr-2' /> Edit Profile
            </button>
          </div>
          {/* Additional profile details can go here */}
        </section>

        {/* Past Assessments Section */}
        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6 flex items-center'>
            <CalendarDays className='h-6 w-6 text-primary mr-3' /> Past Assessments
          </h2>
          <div className='overflow-x-auto bg-card rounded-lg shadow-md'>
            <table className='min-w-full divide-y divide-border'>
              <thead className='bg-muted/50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>Date</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>Type</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>Risk Level</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-card divide-y divide-border'>
                {pastAssessments.length > 0 ? (
                  pastAssessments.map((assessment) => (
                    <tr key={assessment.id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>{new Date(assessment.date).toLocaleDateString()}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>{assessment.type}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          assessment.riskLevel === 'Low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                          assessment.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        }`}>
                          {assessment.riskLevel}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm'>
                        <button 
                            onClick={() => handleShareClick(assessment)}
                            disabled={assessment.isSharedWithProfessional}
                            className={`flex items-center mr-2 px-3 py-1.5 text-xs rounded-md transition-colors ${
                                assessment.isSharedWithProfessional 
                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                        >
                           {assessment.isSharedWithProfessional ? 'Shared' : 'Share'}
                        </button>
                        <Link href={assessment.reportLink} className='text-primary hover:underline flex items-center'>
                          <BookOpenCheck className='h-4 w-4 mr-1' /> View Report
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className='px-6 py-4 text-center text-muted-foreground'>No past assessments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {pastAssessments.length > 0 && (
             <div className='mt-4 text-right'>
                <Link href='/assessment/history' className='text-sm text-primary hover:underline flex items-center justify-end'>
                    View All Assessments <TrendingUp className='h-4 w-4 ml-1' />
                </Link>
            </div>
          )}
        </section>

        {/* Settings Section */}
        <section>
          <h2 className='text-2xl font-semibold mb-6 flex items-center'>
            <Settings className='h-6 w-6 text-primary mr-3' /> App Settings
          </h2>
          <div className='p-6 bg-card rounded-lg shadow-md space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium'>Language</h3>
                <p className='text-sm text-muted-foreground'>Current: {user.preferences?.language || 'en'}</p>
              </div>
              <button className='px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10'>
                Change Language
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium'>Theme</h3>
                <p className='text-sm text-muted-foreground'>Current: {user.preferences?.theme || 'System'}</p>
              </div>
              {/* Assuming ThemeProvider handles this, or a dedicated component would */}
              <ThemeToggleButton />
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium'>Enable Notifications</h3>
                <p className='text-sm text-muted-foreground'>{user.preferences?.receiveNotifications ? 'Enabled' : 'Disabled'}</p>
              </div>
              <button className={`px-4 py-2 border rounded-md ${
                                 user.preferences?.receiveNotifications 
                                   ? 'border-destructive text-destructive hover:bg-destructive/10' 
                                   : 'border-primary text-primary hover:bg-primary/10'}`}
              >
                {user.preferences?.receiveNotifications ? 'Disable' : 'Enable'}
              </button>
            </div>
            {/* Add more settings as needed */}
          </div>
        </section>
      </main>

      {/* Footer (Assuming a similar layout to other pages) */}
      <footer className='py-6 md:px-8 md:py-0 border-t'>
        <div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
          <p className='text-center text-sm leading-loose text-muted-foreground md:text-left'>
            &copy; {new Date().getFullYear()} Predictive Health Monitoring. All rights reserved.
          </p>
          <div className='flex space-x-4'>
            <Link href='/privacy' className='text-sm text-muted-foreground hover:text-primary'>Privacy Policy</Link>
            <Link href='/terms' className='text-sm text-muted-foreground hover:text-primary'>Terms of Service</Link>
          </div>
        </div>
      </footer>

      {/* Consent Modal Copy from ReportPage (can be refactored into a shared component) */}
      {showConsentModal && selectedAssessmentForSharing && (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <div className='bg-card p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full mx-2'>
            <h3 className='text-xl font-semibold mb-4 text-primary'>Consent to Share Assessment Data</h3>
            <p className='text-sm text-foreground/80 mb-2'>
              You are about to share the assessment for <strong className='text-primary/90'>{selectedAssessmentForSharing.type}</strong> taken on <strong className='text-primary/90'>{new Date(selectedAssessmentForSharing.date).toLocaleDateString()}</strong>.
            </p>
            <p className='text-sm text-foreground/80 mb-6'>
              This includes your personal inputs, risk scores, and any generated recommendations. The data will be shared with a medical professional for review and potential follow-up care. 
              Do you consent to this sharing?
            </p>
            <div className='flex justify-end space-x-3'>
              <button 
                onClick={() => handleShareConsent(false)} 
                className='px-5 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 transition-colors'>
                Cancel
              </button>
              <button 
                onClick={() => handleShareConsent(true)} 
                className='px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors'>
                Yes, Share Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileView; 