'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { notFound, useRouter } from 'next/navigation';
import PageLayout from '@/components/layout/page-layout';
import { Heart, Droplet, Zap, CheckCircle, Loader2, AlertTriangle, Activity, Brain } from 'lucide-react';
import { useAuth } from '../../../providers/auth-provider';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Scorecard {
  category: string;
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  details: string;
}

interface ReportData {
  _id: string;
  assessmentId: string;
  userId: {
    name: string;
    email: string;
  };
  reportData: {
    riskSummary: string;
    scorecards: Scorecard[];
  };
  generatedAt: string;
}

const RiskScoreCard = ({ 
  icon, 
  title, 
  score, 
  level, 
  description 
}: { 
  icon: React.ReactNode;
  title: string;
  score: number;
  level: string;
  description: string;
}) => {
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
        <div className={`bg-card/70 backdrop-blur-md p-6 rounded-xl shadow-lg transition-all duration-300 border ${border} ${shadow} hover:scale-105`}>
            <div className="flex items-center mb-4">
                <div className={`p-2 rounded-full mr-4 ${bg} ${text}`}>{icon}</div>
                <h3 className={`text-xl font-semibold ${text}`}>{title}</h3>
            </div>
            <div className="text-center my-4">
                <p className={`text-6xl font-bold ${text}`}>{score}</p>
                <p className={`text-lg font-semibold mt-2 ${text}`}>{level} Risk</p>
            </div>
            <p className="text-muted-foreground text-center text-sm leading-relaxed">{description}</p>
        </div>
    );
};

const getCategoryIcon = (category: string) => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('cardiovascular') || categoryLower.includes('heart')) {
    return <Heart className="w-6 h-6" />;
  } else if (categoryLower.includes('lifestyle')) {
    return <Activity className="w-6 h-6" />;
  } else if (categoryLower.includes('dietary') || categoryLower.includes('diet')) {
    return <Droplet className="w-6 h-6" />;
  } else if (categoryLower.includes('mental') || categoryLower.includes('brain')) {
    return <Brain className="w-6 h-6" />;
  } else if (categoryLower.includes('diabetes')) {
    return <Zap className="w-6 h-6" />;
  } else {
    return <Activity className="w-6 h-6" />;
  }
};

export default function DetailedReportPage({ params }: { params: { assessmentId: string } }) {
  const { user, loading: authLoading } = useAuth();
  const { assessmentId } = params;
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchReport = useCallback(async () => {
    try {
      const response = await fetch(`/api/report/${assessmentId}`);
      if (response.ok) {
        const { data } = await response.json();
        setReport(data);
        setIsGenerating(false);
        return true;
      }
      if (response.status === 404) {
        return false;
      }
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Failed to load report: ${errorMessage}`);
      console.error("Error fetching report:", e);
      return false; // Indicate failure
    }
  }, [assessmentId]);

  const handleGenerateReport = useCallback(async () => {
      if (!user) return;
      setIsGenerating(true);
      setError(null);
      toast.loading('Generating your personalized health report...', { id: 'generating-report' });
      
      try {
          const token = await user.getIdToken();
          const response = await fetch('/api/insights/generate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ assessmentId }),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to start report generation.');
          }

          // Start polling
          const interval = setInterval(async () => {
              const found = await fetchReport();
              if (found) {
                  toast.success('Report generated successfully!', { id: 'generating-report' });
                  clearInterval(interval);
              }
          }, 5000); // Poll every 5 seconds

      } catch (e) {
          const errorMessage = e instanceof Error ? e.message : String(e);
          setError(`Report generation failed: ${errorMessage}`);
          toast.error(`Error: ${errorMessage}`, { id: 'generating-report' });
          setIsGenerating(false);
      }
  }, [user, assessmentId, fetchReport]);

  useEffect(() => {
    if (authLoading) return; // Wait for user auth state to be resolved
    if (!user) {
        toast.error('You must be logged in to view reports.');
        router.push('/auth/login');
        return;
    }
    
    const initializeReport = async () => {
      setIsLoading(true);
      const reportExists = await fetchReport();
      if (!reportExists) {
        handleGenerateReport();
      } else {
        setIsLoading(false);
        }
    };

    initializeReport();
  }, [assessmentId, user, authLoading, fetchReport, handleGenerateReport, router]);

  if (isLoading || isGenerating) {
    return (
      <PageLayout>
        <div className="flex flex-col justify-center items-center h-full min-h-[50vh]">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="mt-4 text-xl text-muted-foreground">
              {isLoading ? 'Loading your report...' : 'Generating your report, this may take a moment...'}
          </p>
                </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-center py-16 bg-card/80 backdrop-blur-md rounded-xl shadow-lg border-2 border-dashed border-red-500">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-4 text-red-500">Error Loading Report</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/history">
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform">
              Back to History
            </button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  if (!report) {
     // This state should ideally be covered by the loading/generating/error states
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-full text-muted-foreground">
          <p>Report not found and generation could not be started.</p>
        </div>
      </PageLayout>
    );
  }
  
  const { riskSummary, scorecards } = report.reportData;

  return (
    <PageLayout>
      <header className="w-full mb-12">
        <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Health Assessment Report</h2>
        <p className="text-xl text-muted-foreground">
          For {report.userId.name} | Generated on {new Date(report.generatedAt).toLocaleDateString('en-US', { dateStyle: 'full' })}
        </p>
      </header>

      {/* Risk Summary Section */}
      <section className="w-full mb-12">
        <div className="bg-card/80 backdrop-blur-md rounded-xl shadow-lg p-8 border border-border/20">
          <h3 className="text-2xl font-semibold mb-4 text-center text-primary">Health Risk Summary</h3>
          <p className="text-muted-foreground leading-relaxed text-lg text-center">{riskSummary}</p>
        </div>
      </section>

      {/* Risk Scorecards Section */}
      <section className="w-full mb-12">
        <h3 className="text-3xl font-semibold mb-6 text-center">Your Risk Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scorecards.map((scorecard, index) => (
              <RiskScoreCard 
                key={index}
                icon={getCategoryIcon(scorecard.category)}
                title={scorecard.category}
                score={scorecard.score}
                level={scorecard.riskLevel}
                description={scorecard.details}
              />
            ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full text-center">
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-8 border border-purple-500/20">
          <h3 className="text-2xl font-semibold mb-4">Ready for Personalized Recommendations?</h3>
          <p className="text-muted-foreground mb-6">Get AI-powered health advice based on your assessment results.</p>
          <Link href="/recommendations">
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform">
              View Recommendations
            </button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
} 