'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ThemeToggleButton } from '@/components/theme-toggle-button'; // Assuming this is the correct path

// Mock data structure (align with backend)
interface ReportData {
  assessmentId: string;
  userId: string;
  submittedAt: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Unknown';
  riskScore: number;
  summary: string;
  detailedReport: {
    bloodPressure?: { value: string; status: string };
    cholesterol?: { value: string; status: string };
    lifestyleFactors?: Array<{ factor: string; status: string; impact: string }>;
    chartsData?: {
      riskOverTime?: Array<{ date: string; score: number }>;
      categoryBreakdown?: Array<{ name: string; score: number; color: string }>;
    };
    // Add other potential fields from backend mock
    dietQuality?: string;
    activityLevel?: string;
  };
  isSharedWithProfessional: boolean;
  // recommendations?: Array<{ category: string; advice: string; priority: string }>; // Might come from a separate call or be embedded
}

const riskColors: Record<string, string> = {
  Low: 'text-green-500 dark:text-green-400',
  Medium: 'text-yellow-500 dark:text-yellow-400',
  High: 'text-red-500 dark:text-red-400',
  Unknown: 'text-gray-500 dark:text-gray-400',
};

const riskBgColors: Record<string, string> = {
  Low: 'bg-green-100 dark:bg-green-900/50',
  Medium: 'bg-yellow-100 dark:bg-yellow-800/50',
  High: 'bg-red-100 dark:bg-red-900/50',
  Unknown: 'bg-gray-100 dark:bg-gray-700/50',
};

const ReportDetailsView = () => {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.assessmentId as string;

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    if (assessmentId) {
      const fetchReport = async () => {
        setLoading(true);
        setError(null);
        try {
          // TODO: Replace with actual API base URL from env var if needed
          const response = await fetch(`/api/report/${assessmentId}`); 
          if (!response.ok) {
            throw new Error(`Failed to fetch report: ${response.statusText} (Status: ${response.status})`);
          }
          const result = await response.json();
          setReportData(result.data);
        } catch (err: any) {
          console.error("Error fetching report:", err);
          setError(err.message || "An unknown error occurred.");
        }
        setLoading(false);
      };
      fetchReport();
    }
  }, [assessmentId]);

  const handleShareConsent = async (consentGiven: boolean) => {
    setShowConsentModal(false);
    if (consentGiven && reportData) {
      console.log(`User consented to share assessment: ${reportData.assessmentId}`);
      try {
        const response = await fetch(`/api/report/${reportData.assessmentId}/share`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sharedWith: 'medical_professional_placeholder@example.com', method: 'system_flag' }),
        });
        if (!response.ok) {
          throw new Error('Failed to update sharing status');
        }
        const result = await response.json();
        console.log("Sharing update response:", result.message);
        // Optimistically update UI or re-fetch report
        setReportData(prevData => prevData ? { ...prevData, isSharedWithProfessional: true } : null);
        alert("Assessment will be shared with a medical professional."); // Placeholder feedback
      } catch (err: any) {
        console.error("Error sharing report:", err);
        alert(`Error initiating share: ${err.message}`);
      }
    } else {
      console.log("User declined to share or no report data.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <p className="mt-4 text-lg">Loading Report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="bg-red-100 dark:bg-red-800/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg shadow-md max-w-md w-full">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            onClick={() => router.push('/')} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors w-full">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <p className="text-xl text-muted-foreground">Report not found.</p>
        <button 
            onClick={() => router.push('/')} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
            Back to Dashboard
          </button>
      </div>
    );
  }

  // Simple Chart Component (Placeholder - consider a library like Recharts for actual charts)
  const SimpleBarChart = ({ data, title }: { data: Array<{ name: string; score: number; color: string }>, title: string }) => (
    <div className="p-4 bg-card rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-foreground/90">{title}</h3>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center">
            <span className="w-28 text-sm text-muted-foreground">{item.name}</span>
            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-4">
              <div 
                style={{ width: `${item.score}%`, backgroundColor: item.color || 'var(--primary)' }}
                className="h-4 rounded-full text-xs text-white flex items-center justify-end pr-2">
                {item.score}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8">
       {/* Simplified Nav - can be expanded or made into a reusable component */}
      <nav className="w-full max-w-5xl mb-6 p-3 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Predictive Health
          </Link>
          <div className="flex items-center space-x-3">
            <Link href="/assessment" className="text-sm hover:text-primary transition-colors">New Assessment</Link>
            <ThemeToggleButton />
          </div>
        </div>
      </nav>

      <main className="w-full max-w-5xl space-y-6">
        <header className="p-6 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Health Assessment Report</h1>
              <p className="text-sm text-muted-foreground">
                Assessment ID: {reportData.assessmentId} | Submitted: {new Date(reportData.submittedAt).toLocaleDateString()}
              </p>
            </div>
            <div className={`mt-3 md:mt-0 px-4 py-2 rounded-lg text-center ${riskBgColors[reportData.riskLevel]} ${riskColors[reportData.riskLevel]}`}>
              <span className="font-semibold block text-sm">Overall Risk</span>
              <span className="font-bold text-xl">{reportData.riskLevel} ({reportData.riskScore}%)</span>
            </div>
          </div>
          <p className="text-foreground/90 mt-2">{reportData.summary}</p>
        </header>

        {/* Detailed Report Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder for Charts - using SimpleBarChart for now */}
          {reportData.detailedReport.chartsData?.categoryBreakdown && (
             <SimpleBarChart data={reportData.detailedReport.chartsData.categoryBreakdown} title="Category Breakdown" />
          )}

          {/* Lifestyle Factors / Key Metrics */}
          <div className="p-4 bg-card rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-foreground/90">Key Health Indicators</h3>
            <ul className="space-y-2 text-sm">
              {reportData.detailedReport.bloodPressure && (
                <li className="flex justify-between"><span>Blood Pressure:</span> <span className={`font-medium ${reportData.detailedReport.bloodPressure.status === 'Normal' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{reportData.detailedReport.bloodPressure.value} ({reportData.detailedReport.bloodPressure.status})</span></li>
              )}
              {reportData.detailedReport.cholesterol && (
                <li className="flex justify-between"><span>Cholesterol:</span> <span className={`font-medium ${reportData.detailedReport.cholesterol.status === 'Normal' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{reportData.detailedReport.cholesterol.value} ({reportData.detailedReport.cholesterol.status})</span></li>
              )}
              {reportData.detailedReport.dietQuality && (
                <li className="flex justify-between"><span>Diet Quality:</span> <span className="font-medium">{reportData.detailedReport.dietQuality}</span></li>
              )}
              {reportData.detailedReport.activityLevel && (
                <li className="flex justify-between"><span>Activity Level:</span> <span className="font-medium">{reportData.detailedReport.activityLevel}</span></li>
              )}
              {reportData.detailedReport.lifestyleFactors?.map(factor => (
                <li key={factor.factor} className="flex justify-between"><span>{factor.factor}:</span> <span className={`font-medium ${factor.impact === 'Positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{factor.status}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contextual Interpretation/Recommendations Summary (can be a separate component later) */}
        <section className="p-6 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-3 text-primary">Understanding Your Results</h2>
          <p className="text-foreground/80 mb-4">
            This report provides a snapshot of your health based on the information you provided. 
            A <span className={`font-semibold ${riskColors[reportData.riskLevel]}`}>{reportData.riskLevel} risk</span> suggests areas where lifestyle changes might be beneficial.
            {reportData.riskLevel === 'High' && " It is strongly recommended to discuss these results with a healthcare professional."}
            {reportData.riskLevel === 'Medium' && " Consider discussing these results with a healthcare professional for further guidance."}
          </p>
          {/* Placeholder for more detailed interpretation or link to full recommendations */}
          <Link href={`/recommendations?assessmentId=${assessmentId}`}>
             <button className="mt-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                View Personalized Recommendations
              </button>
          </Link>
        </section>
        
        {/* Data Sharing Section */}
        <section className="p-6 bg-card/70 backdrop-blur-sm rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-3 text-primary">Share Your Report</h2>
          {reportData.isSharedWithProfessional ? (
            <div className="p-4 bg-green-100 dark:bg-green-900/60 rounded-md text-green-700 dark:text-green-300">
              <p>This report has been marked for sharing with a medical professional.</p>
            </div>
          ) : (
            <>
              <p className="text-foreground/80 mb-4">
                Would you like to share this assessment with a medical professional for review? 
                This can help them understand your current health status better.
              </p>
              <button 
                onClick={() => setShowConsentModal(true)} 
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                Share with Professional
              </button>
            </>
          )}
        </section>
      </main>

      {/* Footer - can be a reusable component */}
      <footer className="w-full max-w-5xl mt-10 pt-6 border-t border-border text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Predictive Health Monitoring. All rights reserved.</p>
      </footer>

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full mx-2">
            <h3 className="text-xl font-semibold mb-4 text-primary">Consent to Share Data</h3>
            <p className="text-sm text-foreground/80 mb-6">
              You are about to share your assessment results (including personal inputs, risk scores, and generated recommendations) with a medical professional. This data will be used for review and potential follow-up care. 
              Do you consent to this sharing?
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => handleShareConsent(false)} 
                className="px-5 py-2 rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => handleShareConsent(true)} 
                className="px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
                Yes, Share Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetailsView; 