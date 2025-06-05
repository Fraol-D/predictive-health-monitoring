'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, FileText, ChevronRight } from 'lucide-react';
import PageLayout from '@/components/layout/page-layout';

// Mock data for the assessment history list
const mockAssessmentHistory = [
  {
    id: 'assessment-id-1',
    timestamp: '2023-10-28T10:00:00Z',
    overallRisk: {
      score: 65,
      level: 'Medium',
    },
  },
  {
    id: 'assessment-id-2',
    timestamp: '2023-09-15T14:30:00Z',
    overallRisk: {
      score: 30,
      level: 'Low',
    },
  },
  {
    id: 'assessment-id-3',
    timestamp: '2023-07-02T09:00:00Z',
    overallRisk: {
      score: 80,
      level: 'High',
    },
  },
];

const getRiskStyling = (level: string) => {
  switch (level) {
    case 'High':
    case 'Very High':
      return 'text-red-400 border-red-400/50';
    case 'Medium':
      return 'text-yellow-400 border-yellow-400/50';
    case 'Low':
    default:
      return 'text-green-400 border-green-400/50';
  }
};

export default function ReportHistoryPage() {
  return (
    <PageLayout>
      <header className="w-full mb-12">
        <h2 className="text-4xl font-bold mb-2">Assessment History</h2>
        <p className="text-xl text-muted-foreground">
          Review your past health assessments and track your progress.
        </p>
      </header>

      <section className="w-full">
        {mockAssessmentHistory.length > 0 ? (
          <div className="space-y-6">
            {mockAssessmentHistory.map((assessment) => (
              <Link href={`/report/${assessment.id}`} key={assessment.id}>
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
                       <div className={`text-right ${getRiskStyling(assessment.overallRisk.level)}`}>
                          <p className="text-2xl font-bold">{assessment.overallRisk.score}%</p>
                          <p className="text-sm font-semibold">{assessment.overallRisk.level} Risk</p>
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