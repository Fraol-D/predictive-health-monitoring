'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/layout/page-layout';
import { Heart, Droplet, Zap, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../providers/auth-provider'; // Adjust import path
import Link from 'next/link'; // Added missing import

interface RiskInfoDetail {
  score: number;
  level: 'Low' | 'Medium' | 'High' | 'Very High';
  description: string;
}

interface ReportData {
  databaseId: string;
  assessmentId: string;
  userId: string;
  firebaseUID: string;
  userName: string;
  userEmail: string;
  date: string; // ISO date string
  fullAssessmentData: any; // Use a more specific type if known
  riskScores: {
    diabetes: RiskInfoDetail;
    hypertension: RiskInfoDetail;
    heartDisease: RiskInfoDetail;
  };
  recommendations: Array<{
    id: string;
    recommendationId: string;
    category: string;
    advice: string;
    generatedAt: string;
  }>;
}

const RiskScoreCard = ({ icon, title, score, level, description }: { icon: React.ReactNode, title: string, score: number, level: string, description: string }) => {
    const getRiskStyling = (level: string) => {
        switch (level) {
            case 'High':
            case 'Very High':
            return {
                bg: 'bg-red-500/10',
                text: 'text-red-400',
                border: 'border-red-500/30',
                shadow: 'hover:shadow-red-500/20'
            };
            case 'Medium':
            return {
                bg: 'bg-yellow-500/10',
                text: 'text-yellow-400',
                border: 'border-yellow-500/30',
                shadow: 'hover:shadow-yellow-500/20'
            };
            case 'Low':
            default:
            return {
                bg: 'bg-green-500/10',
                text: 'text-green-400',
                border: 'border-green-500/30',
                shadow: 'hover:shadow-green-500/20'
            };
        }
    };
    const { bg, text, border, shadow } = getRiskStyling(level);

    return (
        <div className={`bg-card/70 backdrop-blur-md p-6 rounded-xl shadow-lg transition-all duration-300 border ${border} ${shadow}`}>
            <div className="flex items-center mb-4">
                <div className={`p-2 rounded-full mr-4 ${bg} ${text}`}>{icon}</div>
                <h3 className={`text-xl font-semibold ${text}`}>{title}</h3>
            </div>
            <div className="text-center my-4">
                <p className={`text-6xl font-bold ${text}`}>{score}%</p>
                <p className={`text-lg font-semibold mt-2 ${text}`}>{level} Risk</p>
            </div>
            <p className="text-muted-foreground text-center">{description}</p>
        </div>
    );
};

const RecommendationItem = ({ title, description, category }: { title: string, description: string, category: string }) => {
    // The backend Recommendation schema doesn't have a priority field directly.
    // If a priority is needed for display, it would need to be derived or added to the backend schema.
    // For now, assume a default or remove priority styling.
    const displayPriority = 'Medium'; // Placeholder

    const getPriorityStyling = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'text-red-400 bg-red-500/10';
            case 'Medium':
                return 'text-yellow-400 bg-yellow-500/10';
            default:
                return 'text-green-400 bg-green-500/10';
        }
    };

    return (
        <div className="bg-card/50 p-5 rounded-lg border border-border/20 flex items-start justify-between">
             <div className="flex items-start">
                <div className="p-2 bg-primary/20 text-primary rounded-full mr-4">
                    <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-semibold text-lg">{title || category}</h4> {/* Use category as fallback for title */}
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
            <span className={`ml-4 px-3 py-1 text-sm font-semibold rounded-full whitespace-nowrap ${getPriorityStyling(displayPriority)}`}>
                {displayPriority} Priority
            </span>
        </div>
    )
}

export default function DetailedReportPage({ params }: { params: { assessmentId: string } }) {
  const { user } = useAuth();
  const { assessmentId } = params; // This is the frontend-generated UUID
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!user) {
        setError('Please log in to view reports.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        // Fetch report data from your Next.js API route
        const response = await fetch(`/api/report/${assessmentId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound(); // Use Next.js notFound if report not found
          }
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: ReportData = await response.json();
        setReport(data);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(`Failed to load report: ${errorMessage}`);
        console.error("Error fetching detailed report:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [assessmentId, user]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading report...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-center py-16 bg-card/80 backdrop-blur-md rounded-xl shadow-lg border-2 border-dashed border-red-500">
          <h3 className="text-2xl font-semibold mb-4 text-red-500">Error Loading Report</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/report">
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform">
              View All Reports
            </button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  if (!report) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-full text-muted-foreground">
          <p>Report not found.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <header className="w-full mb-12">
        <h2 className="text-4xl font-bold mb-2">Assessment Report Details</h2>
        <p className="text-xl text-muted-foreground">
          Generated on {new Date(report.date).toLocaleDateString('en-US', { dateStyle: 'full' })}
        </p>
      </header>

      {/* Risk Scores Section */}
      <section className="w-full mb-12">
        <h3 className="text-3xl font-semibold mb-6 text-center">Your Risk Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <RiskScoreCard icon={<Droplet />} title="Diabetes" {...report.riskScores.diabetes} />
            <RiskScoreCard icon={<Zap />} title="Hypertension" {...report.riskScores.hypertension} />
            <RiskScoreCard icon={<Heart />} title="Heart Disease" {...report.riskScores.heartDisease} />
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="w-full">
        <h3 className="text-3xl font-semibold mb-6 text-center">Personalized Recommendations</h3>
        <div className="max-w-4xl mx-auto space-y-6">
            {report.recommendations.map((rec) => (
                <RecommendationItem key={rec.id} title={rec.category} description={rec.advice} category={rec.category} />
            ))}
        </div>
      </section>
    </PageLayout>
  );
} 