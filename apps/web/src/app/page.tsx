'use client'; // Required for the withAuth HOC

import React from 'react';
import Link from 'next/link';
import PageLayout from '@/components/layout/page-layout';
import { withAuth } from '@/components/with-auth'; // Import the HOC

const HomePage = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <header className="w-full mb-12 text-center p-8 bg-card/50 backdrop-blur-sm rounded-xl shadow-md">
        <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Take Control of Your Health
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Assess your chronic disease risks and get personalized insights.
        </p>
        <div>
          <Link href="/assessment">
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform">
              Start Assessment
            </button>
          </Link>
        </div>
      </header>

      {/* Recent Risk Cards Section */}
      <section className="w-full mb-12">
        <h3 className="text-3xl font-semibold mb-6 text-center md:text-left">Recent Assessments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder Card 1 */}
          <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-primary/30 transition-shadow">
            <h4 className="text-xl font-semibold mb-2">Diabetes Risk</h4>
            <p className="text-sm text-muted-foreground mb-1">Assessed: 2 days ago</p>
            <p className="text-2xl font-bold text-yellow-400">Medium Risk (65%)</p>
            <Link href="/report/mockReportId123">
              <button className="mt-4 px-4 py-2 rounded-lg bg-primary/80 hover:bg-primary text-primary-foreground text-sm w-full transition-colors font-semibold">
                View Report
              </button>
            </Link>
          </div>
          {/* Placeholder Card 2 */}
          <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-accent/30 transition-shadow">
            <h4 className="text-xl font-semibold mb-2">Heart Disease Risk</h4>
            <p className="text-sm text-muted-foreground mb-1">Assessed: 1 week ago</p>
            <p className="text-2xl font-bold text-green-400">Low Risk (30%)</p>
            <Link href="/report/mockReportId456">
              <button className="mt-4 px-4 py-2 rounded-lg bg-primary/80 hover:bg-primary text-primary-foreground text-sm w-full transition-colors font-semibold">
                View Report
              </button>
            </Link>
          </div>
          {/* Placeholder Card 3 (Empty State) */}
          <div className="bg-card/70 backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[180px] border-2 border-dashed border-border hover:border-primary/50 transition-colors">
            <p className="text-muted-foreground mb-2">No new assessments</p>
            <Link href="/assessment">
              <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/90 text-foreground text-sm transition-colors font-semibold">
                Take New Assessment
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Buttons Section */}
      <section className="w-full">
        <h3 className="text-3xl font-semibold mb-6 text-center md:text-left">Explore</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/report" className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow text-center flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-semibold mb-2">View Full History</h4>
              <p className="text-muted-foreground mb-4">Track your progress over time.</p>
            </div>
            <button className="w-full mt-auto px-6 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-colors">
              Go to History
            </button>
          </Link>
          <Link href="/recommendations" className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-accent/20 transition-shadow text-center flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-semibold mb-2">Get Recommendations</h4>
              <p className="text-muted-foreground mb-4">Personalized advice for a healthier you.</p>
            </div>
            <button className="w-full mt-auto px-6 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent font-semibold transition-colors">
              See Recommendations
            </button>
          </Link>
          <Link href="/chat" className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow text-center flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-semibold mb-2">AI Health Assistant</h4>
              <p className="text-muted-foreground mb-4">Chat directly with our AI.</p>
            </div>
            <button className="w-full mt-auto px-6 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-colors">
              Start Chatting
            </button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default withAuth(HomePage); // Wrap the component with the HOC
