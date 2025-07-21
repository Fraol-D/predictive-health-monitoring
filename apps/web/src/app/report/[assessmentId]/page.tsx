'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import PageLayout from '@/components/layout/page-layout';
import { useAuth } from '../../../providers/auth-provider';
import { ReportData } from '@/components/report/report-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ReportView = dynamic(() => import('@/components/report/report-view').then(mod => mod.ReportView), {
  ssr: false,
  loading: () => <p>Loading report visuals...</p>,
});

export default function DetailedReportPage() {
  const { user } = useAuth();
  const params = useParams();
  const assessmentId = params.assessmentId as string;

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportById = async () => {
      if (!user || !assessmentId) {
        setIsLoading(false);
        setError('User or Assessment ID is missing.');
        console.error('Missing user or assessmentId:', { user: !!user, assessmentId });
        return;
      }
      
      try {
        setIsLoading(true);
        console.log('Fetching report for assessmentId:', assessmentId);
        
        const response = await fetch(`/api/report/${assessmentId}`);
        console.log('API response status:', response.status);

        if (response.status === 404) {
          setError('Report not found.');
          setReportData(null);
          return;
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched detailed report:', data);
        
        // Handle the riskScores structure properly
        if (!data.riskScores) {
          throw new Error('Risk scores data is missing from the report');
        }

        const scorecards = [];
        
        // Handle individual risk categories (diabetes, heartDisease, hypertension)
        Object.entries(data.riskScores).forEach(([category, details]) => {
          if (category !== 'overall' && typeof details === 'object' && details !== null) {
            const scorecard = {
              category: category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1').trim(),
              score: details.score || 0,
              level: details.level || 'Low',
              recommendation: details.description || '',
            };
            scorecards.push(scorecard);
          }
        });
        
        // Add overall risk as a separate scorecard if it exists
        if (typeof data.riskScores.overall === 'number') {
          const overallLevel = data.riskScores.overall > 75 ? 'High' : 
                              data.riskScores.overall > 50 ? 'Medium' : 'Low';
          scorecards.unshift({
            category: 'Overall Risk',
            score: data.riskScores.overall,
            level: overallLevel,
            recommendation: `Overall health risk assessment based on all factors`,
          });
        }

        console.log('Processed scorecards:', scorecards);

        setReportData({
            riskSummary: data.reportSummary || 'No summary available',
            scorecards: scorecards,
            generatedAt: data.createdAt || new Date().toISOString(),
        });

      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(`Failed to fetch report: ${errorMessage}`);
        console.error("Error fetching report:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportById();
  }, [user, assessmentId]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading your detailed report...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-destructive">Error Loading Report</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Link href="/report">Back to Reports</Link>
          </Button>
        </div>
      );
    }

    if (!reportData) {
      return (
        <div className="text-center py-16 bg-card/80 backdrop-blur-md rounded-xl shadow-lg border-2 border-dashed border-border">
          <h3 className="text-2xl font-semibold mb-4">No Report Data</h3>
          <p className="text-muted-foreground mb-6">Could not find data for this report.</p>
          <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Link href="/report">Back to Reports</Link>
          </Button>
        </div>
      );
    }

    return <ReportView reportData={reportData} />;
  };

  return (
    <PageLayout>
      <header className="w-full mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Detailed Health Report</h2>
            <p className="text-xl text-muted-foreground">
              A detailed breakdown of your health assessment.
            </p>
          </div>
          <Button asChild variant="outline" className="border-purple-400/50 hover:bg-purple-500/10">
            <Link href="/report">← Back to Reports</Link>
          </Button>
        </div>
      </header>

      <section className="w-full">
        {renderContent()}
      </section>
    </PageLayout>
  );
} 