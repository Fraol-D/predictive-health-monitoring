'use client';

import React from 'react';
import PageLayout from '@/components/layout/page-layout';
import Link from 'next/link';
import { Heart, Brain, Apple, Dumbbell, LucideIcon } from 'lucide-react';

interface Recommendation {
  id: string;
  category: 'Diet' | 'Exercise' | 'Sleep' | 'Mental Health' | 'General';
  title: string;
  advice: string;
  priority: 'High' | 'Medium' | 'Low';
}

const mockRecommendations: Recommendation[] = [
    { id: 'rec-1', category: 'Diet', title: 'Increase Fiber Intake', advice: 'Incorporate more whole grains, fruits, and vegetables into your diet to improve digestion and cardiovascular health.', priority: 'High'},
    { id: 'rec-2', category: 'Exercise', title: 'Strength Training', advice: 'Add at least two days of strength training to your routine to build muscle mass and boost metabolism.', priority: 'High'},
    { id: 'rec-3', category: 'Mental Health', title: 'Mindfulness Practice', advice: 'Dedicate 10-15 minutes each day to mindfulness or meditation to reduce stress levels.', priority: 'Medium'},
    { id: 'rec-4', category: 'Diet', title: 'Hydration is Key', advice: 'Aim to drink at least 8 glasses (2 liters) of water per day. Avoid sugary drinks.', priority: 'Medium'},
    { id: 'rec-5', category: 'Exercise', title: 'Incorporate Flexibility', advice: 'Add stretching or yoga to your routine to improve flexibility and reduce risk of injury.', priority: 'Low'},
    { id: 'rec-6', category: 'General', title: 'Annual Check-up', advice: 'Schedule a comprehensive annual health check-up with your doctor to stay proactive about your health.', priority: 'High'},
];


const categoryStyles: Record<string, { icon: LucideIcon; color: string; }> = {
  Diet: { icon: Apple, color: 'text-green-400' },
  Exercise: { icon: Dumbbell, color: 'text-primary' },
  'Mental Health': { icon: Brain, color: 'text-primary' },
  General: { icon: Heart, color: 'text-accent' },
};

const priorityStyles: Record<string, string> = {
  High: 'border-destructive',
  Medium: 'border-yellow-400/50',
  Low: 'border-green-400/50',
};

const RecommendationCard = ({ rec }: { rec: Recommendation }) => {
    const categoryStyle = categoryStyles[rec.category] || categoryStyles.General;
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
                        <p className={`text-sm font-bold ${categoryStyle.color}`}>{rec.category}</p>
        </div>
      </div>
                <p className="text-muted-foreground leading-relaxed">{rec.advice}</p>
      </div>
            <div className="bg-card/50 px-6 py-3 border-t border-border/20 text-right">
                 <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${rec.priority === 'High' ? 'bg-destructive/20 text-destructive' : rec.priority === 'Medium' ? 'bg-yellow-400/20 text-yellow-500' : 'bg-green-400/20 text-green-500'}`}>
                            {rec.priority} Priority
                          </span>
                  </div>
                </div>
              );
}

const RecommendationsView = () => {
  return (
    <PageLayout>
        <header className="w-full mb-12">
          <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Health Recommendations</h2>
          <p className="text-xl text-muted-foreground">
            Personalized advice to help you lead a healthier life.
          </p>
        </header>

        {mockRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockRecommendations.map((rec) => (
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