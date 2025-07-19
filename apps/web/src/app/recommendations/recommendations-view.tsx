'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PageLayout from '@/components/layout/page-layout';
import Link from 'next/link';
import { Heart, Brain, Apple, Dumbbell, LucideIcon, RefreshCw, AlertTriangle, Loader2, Monitor, Pill, Activity } from 'lucide-react';
import { useAuth } from '../../providers/auth-provider';
import toast from 'react-hot-toast';

interface Recommendation {
  _id: string;
  userId: string;
  assessmentId: string;
  recommendationId: string;
  category: 'diet' | 'exercise' | 'lifestyle' | 'medication' | 'monitoring' | 'general';
  title: string;
  advice: string;
  priority: 'Low' | 'Medium' | 'High';
  generatedAt: string;
  source: 'ai' | 'manual';
}

const categoryStyles: Record<string, { icon: LucideIcon; color: string; }> = {
  diet: { icon: Apple, color: 'text-green-400' },
  exercise: { icon: Dumbbell, color: 'text-primary' },
  lifestyle: { icon: Activity, color: 'text-blue-400' },
  medication: { icon: Pill, color: 'text-red-400' },
  monitoring: { icon: Monitor, color: 'text-yellow-400' },
  general: { icon: Heart, color: 'text-accent' },
};

const priorityStyles: Record<string, string> = {
  High: 'border-destructive',
  Medium: 'border-yellow-400/50',
  Low: 'border-green-400/50',
};

const RecommendationCard = ({ rec }: { rec: Recommendation }) => {
    const categoryStyle = categoryStyles[rec.category] || categoryStyles.general;
    const priorityStyle = priorityStyles[rec.priority];
    const IconComponent = categoryStyle.icon;

    return (
        <div className={`bg-card/80 backdrop-blur-md rounded-xl shadow-lg flex flex-col h-full border-l-4 ${priorityStyle} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-primary/20`}>
            <div className="p-6 flex-grow">
                <div className="flex items-center mb-4">
                    <div className={`mr-4 p-2.5 rounded-full bg-card ${categoryStyle.color}`}>
                        <IconComponent size={24} className="text-current" />
      </div>
                    <div>
                        <h3 className="text-xl font-semibold text-foreground">{rec.title}</h3>
                        <p className={`text-sm font-bold capitalize ${categoryStyle.color}`}>{rec.category}</p>
        </div>
      </div>
                <p className="text-muted-foreground leading-relaxed">{rec.advice}</p>
      </div>
            <div className="bg-card/50 px-6 py-3 border-t border-border/20 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                    {new Date(rec.generatedAt).toLocaleDateString()}
                </span>
                 <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${rec.priority === 'High' ? 'bg-destructive/20 text-destructive' : rec.priority === 'Medium' ? 'bg-yellow-400/20 text-yellow-500' : 'bg-green-400/20 text-green-500'}`}>
                            {rec.priority} Priority
                          </span>
                  </div>
                </div>
              );
}

const RecommendationsView = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const response = await fetch(`/api/recommendations/${user.uid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Recommendation[] = await response.json();
      setRecommendations(data);
      if (data.length > 0) {
        // Use the most recent recommendation's generatedAt timestamp
        const mostRecent = data.reduce((latest: Recommendation, current: Recommendation) => 
          new Date(current.generatedAt) > new Date(latest.generatedAt) ? current : latest
        );
        setLastUpdatedAt(new Date(mostRecent.generatedAt));
      } else {
        setLastUpdatedAt(null);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch recommendations';
      setError(errorMessage);
      console.error("Error fetching recommendations:", e);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        await fetchRecommendations();
        setIsLoading(false);
    }
    if (user) {
        loadData();
    } else {
        setIsLoading(false);
        setError('Please log in to view recommendations.');
    }
  }, [user, fetchRecommendations]);

  const handleUpdate = async () => {
    if (!user) {
      toast.error("You must be logged in to update recommendations.");
      return;
    }

    setIsUpdating(true);
    toast.loading("Fetching latest data and generating new recommendations...", { id: "updating-recs" });

    try {
      // 1. Get the latest assessment ID for the user
      const assessmentRes = await fetch(`/api/users/firebase/${user.uid}/latest-assessment`);
      if (!assessmentRes.ok) {
        throw new Error("Could not find a recent assessment to generate new recommendations.");
      }
      const latestAssessment = await assessmentRes.json();
      const assessmentId = latestAssessment._id;

      // 2. Trigger the insight generation
      const token = await user.getIdToken();
      const insightsResponse = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ assessmentId, firebaseUID: user.uid }),
      });

      if (!insightsResponse.ok) {
        const errorData = await insightsResponse.json();
        throw new Error(errorData.error || 'Failed to start recommendation update.');
      }
      
      // 3. Refetch recommendations after a delay
      setTimeout(async () => {
        await fetchRecommendations();
        toast.success("Recommendations have been updated!", { id: "updating-recs" });
        setIsUpdating(false);
      }, 3000); // Simple delay; for production, polling or websockets would be better.

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during update.";
      toast.error(errorMessage, { id: "updating-recs" });
      setError(errorMessage);
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (error && !recommendations.length) {
    return (
      <PageLayout>
        <div className="text-center py-16 bg-card/80 backdrop-blur-md rounded-xl shadow-lg border-2 border-dashed border-red-500">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
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
        <header className="w-full mb-12 flex justify-between items-center">
          <div>
          <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Health Recommendations</h2>
          <p className="text-xl text-muted-foreground">
            Personalized advice to help you lead a healthier life.
          </p>
             {lastUpdatedAt && (
                <p className="text-sm text-muted-foreground mt-2">
                    Last updated: {lastUpdatedAt.toLocaleString()}
                </p>
            )}
          </div>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition-all"
          >
            {isUpdating ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <RefreshCw className="mr-2 h-5 w-5" />
            )}
            {isUpdating ? 'Updating...' : 'Update Recommendations'}
          </button>
        </header>

        {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((rec) => (
                    <RecommendationCard key={rec._id} rec={rec} />
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