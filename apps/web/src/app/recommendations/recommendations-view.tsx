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

const categoryStyles: Record<string, {
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
  iconColor: string;
  border: string;
}> = {
  Diet: { gradientFrom: 'from-green-500', gradientTo: 'to-teal-500', iconBg: 'bg-primary/10', iconColor: 'text-primary', border: 'border-primary/30' },
  Exercise: { gradientFrom: 'from-blue-500', gradientTo: 'to-sky-500', iconBg: 'bg-accent/10', iconColor: 'text-accent', border: 'border-accent/30' },
  Sleep: { gradientFrom: 'from-indigo-500', gradientTo: 'to-violet-500', iconBg: 'bg-primary/10', iconColor: 'text-primary', border: 'border-primary/30' },
  'Mental Health': { gradientFrom: 'from-purple-500', gradientTo: 'to-pink-500', iconBg: 'bg-accent/10', iconColor: 'text-accent', border: 'border-accent/30' },
  General: { gradientFrom: 'from-slate-500', gradientTo: 'to-gray-500', iconBg: 'bg-muted/20', iconColor: 'text-muted-foreground', border: 'border-muted/30' },
};

const priorityStyles: Record<string, { badge: string; border: string }> = {
  High: { badge: 'bg-red-500/20 text-red-500 border-red-500/50', border: 'border-l-4 border-red-500' },
  Medium: { badge: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50', border: 'border-l-4 border-yellow-500' },
  Low: { badge: 'bg-green-500/20 text-green-500 border-green-500/50', border: 'border-l-4 border-green-500' },
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
    <div className="space-y-10">
      {Object.entries(groupedRecommendations).map(([category, recs]) => {
        const catTheme = categoryStyles[category] || categoryStyles.General;
        return (
          <section key={category} className="p-0.5">
            <h2 className={`text-3xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r ${catTheme.gradientFrom} ${catTheme.gradientTo}`}>
              {category} Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recs.map((rec) => {
                const currentPriorityStyle = priorityStyles[rec.priority] || { badge: 'bg-slate-500/20 text-slate-500 border-slate-500/50', border: 'border-l-4 border-slate-300' };
                const currentCategoryStyle = categoryStyles[rec.category] || categoryStyles.General;
                return (
                  <div
                    key={rec.id}
                    className={`bg-card/70 dark:bg-card/60 backdrop-blur-md rounded-xl shadow-xl overflow-hidden flex flex-col h-full ${currentPriorityStyle.border} hover:shadow-primary/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1`}
                  >
                    <div className={`p-5 flex-grow`}>
                      <div className="flex items-start mb-4">
                        {rec.icon && (
                          <div className={`mr-4 p-2.5 rounded-full ${currentCategoryStyle.iconBg}`}>
                             <span className={`text-2xl ${currentCategoryStyle.iconColor}`}>{rec.icon}</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-1">{rec.title}</h3>
                          <span
                            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${currentPriorityStyle.badge} border`}
                          >
                            {rec.priority} Priority
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{rec.advice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

const RecommendationsView = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8">
      <main className="w-full max-w-6xl pt-16">
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