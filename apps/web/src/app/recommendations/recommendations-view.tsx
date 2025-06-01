'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggleButton } from '@/components/theme-toggle-button';

interface Recommendation {
  id: string;
  category: string; // e.g., 'Diet', 'Exercise', 'Sleep', 'Mental Health'
  title: string;
  advice: string;
  priority: 'High' | 'Medium' | 'Low';
  icon?: string; // Emoji or SVG path
}

const categoryStyles: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  Diet: { bg: 'bg-green-50 dark:bg-green-900/30', border: 'border-green-500', text: 'text-green-700 dark:text-green-300', iconBg: 'bg-green-100 dark:bg-green-800/50' },
  Exercise: { bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-300', iconBg: 'bg-blue-100 dark:bg-blue-800/50' },
  Sleep: { bg: 'bg-indigo-50 dark:bg-indigo-900/30', border: 'border-indigo-500', text: 'text-indigo-700 dark:text-indigo-300', iconBg: 'bg-indigo-100 dark:bg-indigo-800/50' },
  'Mental Health': { bg: 'bg-purple-50 dark:bg-purple-900/30', border: 'border-purple-500', text: 'text-purple-700 dark:text-purple-300', iconBg: 'bg-purple-100 dark:bg-purple-800/50' },
  General: { bg: 'bg-slate-50 dark:bg-slate-700/30', border: 'border-slate-500', text: 'text-slate-700 dark:text-slate-300', iconBg: 'bg-slate-100 dark:bg-slate-600/50' },
};

const priorityStyles: Record<string, string> = {
  High: 'border-l-4 border-red-500',
  Medium: 'border-l-4 border-yellow-500',
  Low: 'border-l-4 border-green-500',
};

const RecommendationsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentId = searchParams.get('assessmentId');
  // For now, we can use a mock userId or derive it if an auth system was in place
  const mockUserId = 'mockUser123';

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch recommendations based on userId (or assessmentId if API supports it directly)
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        // const response = await fetch(`/api/recommendations/user/${mockUserId}${assessmentId ? `?assessmentId=${assessmentId}` : ''}`);
        // Using a generic recommendations endpoint for now, assuming it gives a general set if no specific one is tied to user/assessment
        const response = await fetch(`/api/recommendations/${mockUserId}`); // Backend uses userId
        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
        }
        const result = await response.json();
        setRecommendations(result.data || []);
      } catch (err: any) {
        console.error("Error fetching recommendations:", err);
        setError(err.message || "An unknown error occurred.");
      }
      setLoading(false);
    };

    fetchRecommendations();
  }, [mockUserId]); // Removed assessmentId from deps as API only uses userId for now

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
        <p className="mt-4 text-lg">Loading Recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md max-w-md w-full">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            onClick={() => router.back()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors w-full">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-4">
        <p className="text-xl text-muted-foreground mb-4">No recommendations available at this time.</p>
        <p className="text-sm text-muted-foreground mb-6">This might be because you haven't completed an assessment yet, or there are no specific recommendations for your current profile.</p>
        <Link href="/assessment">
          <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
            Take a New Assessment
          </button>
        </Link>
      </div>
    );
  }

  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    const category = rec.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(rec);
    return acc;
  }, {} as Record<string, Recommendation[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedRecommendations).map(([category, recs]) => (
        <section key={category} className="p-0.5"> {/* Minimal padding to allow card shadow */}
          <h2 className={`text-2xl font-semibold mb-5 text-transparent bg-clip-text bg-gradient-to-r ${categoryStyles[category]?.text.includes('green') ? 'from-green-500 to-teal-500' : categoryStyles[category]?.text.includes('blue') ? 'from-blue-500 to-sky-500' : categoryStyles[category]?.text.includes('indigo') ? 'from-indigo-500 to-violet-500' : categoryStyles[category]?.text.includes('purple') ? 'from-purple-500 to-pink-500' : 'from-slate-500 to-gray-500'}`}>
            {category} Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recs.map((rec) => {
              const catStyle = categoryStyles[rec.category] || categoryStyles.General;
              return (
                <div 
                  key={rec.id}
                  className={`rounded-xl shadow-lg overflow-hidden flex flex-col h-full ${catStyle.bg} ${priorityStyles[rec.priority] || 'border-l-4 border-slate-300'} border border-transparent hover:border-current transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <div className={`p-5 flex-grow ${catStyle.text}`}>
                    <div className="flex items-start mb-3">
                      {rec.icon && (
                        <div className={`mr-3 p-2 rounded-full ${catStyle.iconBg}`}>
                           <span className="text-2xl">{rec.icon}</span>
                        </div>
                      )}
                      <h3 className="text-xl font-semibold flex-1">{rec.title}</h3>
                    </div>
                    <p className="text-sm text-foreground/80 dark:text-foreground/70 leading-relaxed">{rec.advice}</p>
                  </div>
                  <div className={`px-5 py-3 text-xs font-medium ${catStyle.text} opacity-80 border-t ${catStyle.border} border-opacity-30`}>
                    Priority: {rec.priority}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

const RecommendationsView = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8">
      <nav className="w-full max-w-6xl mb-8 p-3 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Predictive Health
          </Link>
          <div className="flex items-center space-x-3">
            {/* Consider adding Profile link/icon here */}
            <ThemeToggleButton />
          </div>
        </div>
      </nav>

      <main className="w-full max-w-6xl">
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent pb-2">
            Your Health Recommendations
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Personalized advice to help you lead a healthier life, based on your recent assessment.
          </p>
        </header>
        <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div></div>}>
          <RecommendationsContent />
        </Suspense>
      </main>

      <footer className="w-full max-w-6xl mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Predictive Health Monitoring. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RecommendationsView; 