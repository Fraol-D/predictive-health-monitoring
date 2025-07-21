'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PageLayout from '@/components/layout/page-layout';
import { useAuth } from '../../providers/auth-provider';
import { ReportData } from '@/components/report/report-view';
import { Button } from '@/components/ui/button';

const ReportView = dynamic(() => import('@/components/report/report-view').then(mod => mod.ReportView), {
  ssr: false,
  loading: () => <p>Loading report visuals...</p>,
});


export default function ReportPage() {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestReport = async () => {
      if (!user) {
        setIsLoading(false);
        setError('Please log in to view your report.');
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/firebase/${user.uid}/latest-assessment`);

        if (response.status === 404) {
          setReportData(null);
          return;
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched data:', data);

        const scorecards = Object.entries(data.riskScores).map(([category, details]) => ({
          category: category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1').trim(),
          ...details,
        }));

        setReportData({
            riskSummary: data.reportSummary,
            scorecards: scorecards,
            generatedAt: data.createdAt,
        });

      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(`Failed to fetch report: ${errorMessage}`);
        console.error("Error fetching report:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestReport();
  }, [user]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center"><p>Loading your report...</p></div>;
    }

    if (error) {
      return (
        <div className="text-center py-16 bg-card/80 rounded-xl">
          <h3 className="text-2xl font-semibold mb-4 text-destructive">Error Loading Report</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
        </div>
      );
    }

    if (!reportData) {
      return (
        <div className="text-center py-16 bg-card/50 rounded-xl">
          <h3 className="text-2xl font-semibold mb-4">No Report Found</h3>
          <p className="text-muted-foreground mb-6">Please complete an assessment to generate your first report.</p>
          <Button asChild>
            <Link href="/assessment">Start Your First Assessment</Link>
          </Button>
        </div>
      );
    }

    return <ReportView reportData={reportData} />;
  };

  return (
    <PageLayout>
      <header className="w-full mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-highlight">Your Health Report</h2>
        <p className="text-xl text-muted-foreground">
          An overview of your health based on your latest assessment.
        </p>
      </header>

      <section className="w-full">
        {renderContent()}
      </section>
    </PageLayout>
  );
}