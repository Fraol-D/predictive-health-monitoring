'use client';

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/page-layout';
import Link from 'next/link';
import { Heart, Brain, Apple, Dumbbell, LucideIcon } from 'lucide-react';
import { useAuth } from '../../providers/auth-provider'; // Import useAuth

interface Recommendation {
  id: string;
  recommendationId: string; // Add this field for the frontend generated ID
  category: 'Diet' | 'Exercise' | 'Sleep' | 'Mental Health' | 'General' | 'medication' | 'monitoring'; // Expanded categories
  title: string; // The backend Recommendation schema doesn't have a title, so we'll use a default or derive from advice.
  advice: string;
  generatedAt: string; // Use string for date from backend
}

const categoryStyles: Record<string, { icon: LucideIcon; color: string; }> = {
  Diet: { icon: Apple, color: 'text-green-400' },
  Exercise: { icon: Dumbbell, color: 'text-primary' },
  'Mental Health': { icon: Brain, color: 'text-primary' },
  General: { icon: Heart, color: 'text-accent' },
  medication: { icon: Heart, color: 'text-red-400' }, // Example new category
  monitoring: { icon: Heart, color: 'text-blue-400' }, // Example new category
};

const priorityStyles: Record<string, string> = {
  High: 'border-destructive',
  Medium: 'border-yellow-400/50',
  Low: 'border-green-400/50',
};

const RecommendationCard = ({ rec }: { rec: Recommendation }) => {
    const categoryStyle = categoryStyles[rec.category] || categoryStyles.General;
    // The backend Recommendation schema doesn't have a priority field directly.
    // If a priority is needed for display, it would need to be derived or added to the backend schema.
    // For now, let's assume all fetched recommendations are of 'Medium' priority for display purposes
    // or we can remove the priority styling if it's not applicable.
    const displayPriority = 'Medium'; // Placeholder
    const priorityStyle = priorityStyles[displayPriority];
    const IconComponent = categoryStyle.icon;

    return (
        <div className={`bg-card/80 backdrop-blur-md rounded-xl shadow-lg flex flex-col h-full border-l-4 ${priorityStyle} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-primary/20`}>
            <div className="p-6 flex-grow">
                <div className="flex items-center mb-4">
                    <div className={`mr-4 p-2.5 rounded-full bg-card ${categoryStyle.color}`}>
                        <IconComponent size={24} className="text-current" />
      </div>
                    <div>
                        <h3 className="text-xl font-semibold text-foreground">{rec.title || rec.category}</h3> {/* Use category as fallback for title */}
                        <p className={`text-sm font-bold ${categoryStyle.color}`}>{rec.category}</p>
        </div>
      </div>
                <p className="text-muted-foreground leading-relaxed">{rec.advice}</p>
      </div>
            <div className="bg-card/50 px-6 py-3 border-t border-border/20 text-right">
                 <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${displayPriority === 'High' ? 'bg-destructive/20 text-destructive' : displayPriority === 'Medium' ? 'bg-yellow-400/20 text-yellow-500' : 'bg-green-400/20 text-green-500'}`}>
                            {displayPriority} Priority
                          </span>
                  </div>
                </div>
              );
}

const RecommendationsView = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setIsLoading(false);
        setError('Please log in to view recommendations.');
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/recommendations/${user.uid}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecommendations(data.data || []); // Assuming data.data holds the array of recommendations
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(`Failed to fetch recommendations: ${errorMessage}`);
        console.error("Error fetching recommendations:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading recommendations...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-center py-16 bg-card/80 backdrop-blur-md rounded-xl shadow-lg border-2 border-dashed border-red-500">
          <h3 className="text-2xl font-semibold mb-4 text-red-500">Error Loading Recommendations</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/assessment">
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform">
              Start an Assessment
            </button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
        <header className="w-full mb-12">
          <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Health Recommendations</h2>
          <p className="text-xl text-muted-foreground">
            Personalized advice to help you lead a healthier life.
          </p>
        </header>

        {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((rec) => (
                    <RecommendationCard key={rec.id} rec={rec} />
                ))}
            </div>
        ) : (
             <div className="text-center py-16 bg-card/80 backdrop-blur-md rounded-xl shadow-lg border-2 border-dashed border-border">
                <h3 className="text-2xl font-semibold mb-4">No Recommendations Available</h3>
                <p className="text-muted-foreground mb-6">Complete an assessment to get personalized health advice.</p>
                <Link href="/assessment">
                  <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform">
                    Start an Assessment
                  </button>
                </Link>
    </div>
        )}
    </PageLayout>
  );
};

export default RecommendationsView; 