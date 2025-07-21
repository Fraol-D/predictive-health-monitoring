'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageLayout from '@/components/layout/page-layout';
import { useAuth } from '../../providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BarChart2, ChevronRight } from 'lucide-react';

interface ReportSummary {
  assessmentId: string;
  createdAt: string;
  overallRisk: {
    score: number;
    level: string;
  };
}

export default function ReportHistoryPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportHistory = async () => {
      if (!user) {
        setIsLoading(false);
        setError('Please log in to view your report history.');
        return;
      }
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/firebase/${user.uid}/assessments`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch report history');
        }
        const data = await response.json();
        console.log('Fetched report history:', data);
        setReports(data);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(`Failed to fetch reports: ${errorMessage}`);
        console.error("Error fetching reports:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportHistory();
  }, [user]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center"><p>Loading your report history...</p></div>;
    }

    if (error) {
      return (
        <div className="text-center py-16 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-destructive">Error Loading History</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
        </div>
      );
    }

    if (reports.length === 0) {
      return (
        <div className="text-center py-16 bg-card/80 backdrop-blur-md rounded-xl shadow-lg border-2 border-dashed border-border">
          <h3 className="text-2xl font-semibold mb-4">No Reports Found</h3>
          <p className="text-muted-foreground mb-6">You have not completed any assessments yet.</p>
          <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Link href="/assessment">Start Your First Assessment</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reports.map(report => (
          <Link href={`/report/${report.assessmentId}`} key={report.assessmentId}>
            <Card className="bg-card/80 backdrop-blur-md hover:bg-card/90 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer border border-border/50 hover:border-purple-400/50">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30">
                    <BarChart2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Report from {new Date(report.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Overall Risk: <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">{report.overallRisk.level} ({report.overallRisk.score}%)</span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-purple-400 transition-colors duration-300" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <PageLayout>
      <header className="w-full mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Report History</h2>
          <p className="text-xl text-muted-foreground">
            View your past health assessments.
          </p>
        </div>
         <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg transform hover:scale-105 transition-all">
            <Link href="/assessment">New Assessment</Link>
          </Button>
      </header>
      <section className="w-full">
        {renderContent()}
      </section>
    </PageLayout>
  );
}