'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, FileText, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/page-layout';
import { useAuth } from '../../providers/auth-provider'; // Import useAuth

interface AssessmentHistoryItem {
  id: string; // This will be the backend's _id
  assessmentId: string; // The frontend-generated UUID
  timestamp: string; // Use createdAt from backend
  riskScores: {
    overall?: number; // Overall risk might be calculated on frontend or backend
    level: 'Low' | 'Medium' | 'High' | 'Very High';
    diabetes: { score: number; level: string; description: string; };
    heartDisease: { score: number; level: string; description: string; };
    hypertension: { score: number; level: string; description: string; };
  };
}

const getRiskStyling = (level: string) => {
  switch (level) {
    case 'High':
    case 'Very High':
      return 'text-destructive border-destructive/50';
    case 'Medium':
      return 'text-yellow-400 border-yellow-400/50';
    case 'Low':
    default:
      return 'text-green-400 border-green-400/50';
  }
};

export default function ReportHistoryPage() {
  const { user } = useAuth();
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessmentHistory = async () => {
      if (!user) {
        setIsLoading(false);
        setError('Please log in to view your assessment history.');
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        // Call Next.js API route to fetch assessments for the current user (firebaseUID)
        const response = await fetch(`/api/assessments/firebase/${user.uid}`);
        console.log('Report Page fetch response:', { status: response.status, ok: response.ok });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Map the backend data to the frontend AssessmentHistoryItem interface
        const mappedData: AssessmentHistoryItem[] = data.map((item: any) => ({
          id: item._id,
          assessmentId: item.assessmentId,
          timestamp: item.createdAt, // Use createdAt from Mongoose timestamps
          riskScores: item.riskScores, // This should match the structure from backend
        }));
        setAssessmentHistory(mappedData);

      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(`Failed to fetch assessment history: ${errorMessage}`);
        console.error("Error fetching assessment history:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessmentHistory();
  }, [user]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading assessment history...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-center py-16 bg-card/80 backdrop-blur-md rounded-xl shadow-lg border-2 border-dashed border-red-500">
          <h3 className="text-2xl font-semibold mb-4 text-red-500">Error Loading History</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/assessment">
            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform">
              Start Your First Assessment
            </button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <header className="w-full mb-12">
        <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Assessment History</h2>
        <p className="text-xl text-muted-foreground">
          Review your past health assessments and track your progress.
        </p>
      </header>

      <section className="w-full">
        {assessmentHistory.length > 0 ? (
          <div className="space-y-6">
            {assessmentHistory.map((assessment) => (
              <Link href={`/report/${assessment.assessmentId}`} key={assessment.id}>
                <div className="bg-card/70 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-primary/30 cursor-pointer group">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <div className="p-3 bg-card rounded-lg mr-4">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Assessment Report</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{new Date(assessment.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`text-right ${getRiskStyling(assessment.riskScores.overall?.level || assessment.riskScores.diabetes.level)}`}> {/* Use overall if available, else diabetes level as fallback */}
                        <p className="text-2xl font-bold">{assessment.riskScores.overall?.score || assessment.riskScores.diabetes.score}%</p> {/* Use overall if available, else diabetes score as fallback */}
                        <p className="text-sm font-semibold">{assessment.riskScores.overall?.level || assessment.riskScores.diabetes.level} Risk</p>
                        </div>
                       <ChevronRight className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                     </div>
                   </div>
                 </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card/50 rounded-xl">
            <h3 className="text-2xl font-semibold mb-4">No History Found</h3>
            <p className="text-muted-foreground mb-6">You have not completed any assessments yet.</p>
            <Link href="/assessment">
              <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform">
                Start Your First Assessment
              </button>
            </Link>
          </div>
        )}
      </section>
    </PageLayout>
  );
}