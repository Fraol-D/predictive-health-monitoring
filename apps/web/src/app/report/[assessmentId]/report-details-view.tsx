'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageLayout from '@/components/layout/page-layout'; // Using the main layout
import { Loader2, AlertTriangle, ChevronRight, Share2, ShieldCheck, PieChart as PieChartIcon, BarChart2 } from 'lucide-react'; // Renamed PieChart to avoid conflict
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';

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

// High-quality, reusable Pie Chart for risk visualization
const RiskPieChart = ({ score }: { score: number }) => {
  const data = [
    { name: 'Risk', value: score },
    { name: 'Safety', value: 100 - score },
  ];
  const COLORS = ['url(#riskGradient)', '#374151']; // Gradient for risk, gray for remainder

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#FF69B4" stopOpacity={0.9}/>
            </linearGradient>
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              background: 'rgba(30, 41, 59, 0.8)', 
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem'
            }}
          />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-foreground">
            {`${score}%`}
          </text>
           <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="text-sm font-medium fill-muted-foreground">
            Risk Score
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};


// High-quality, reusable Bar Chart for trends/breakdowns
const TrendsBarChart = ({ data, title }: { data: Array<{ name: string; score: number }>, title: string }) => (
    <div className="p-6 bg-card/80 backdrop-blur-md rounded-xl shadow-lg h-full">
      <h3 className="text-xl font-semibold mb-4 text-foreground/90 flex items-center"><BarChart2 className="w-5 h-5 mr-3 text-primary" />{title}</h3>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF69B4" stopOpacity={0.8}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              cursor={{ fill: 'rgba(138, 43, 226, 0.1)' }}
              contentStyle={{ 
                background: 'rgba(30, 41, 59, 0.9)', 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem'
              }}
            />
            <Bar dataKey="score" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );


const ReportDetailsView = () => {
  const params = useParams();
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
        } catch (err) {
          console.error("Error fetching report:", err);
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
          setError(errorMessage);
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
      } catch (err) {
        console.error("Error sharing report:", err);
        const errorMessage = err instanceof Error ? err.message : "An error occurred while sharing.";
        alert(`Error initiating share: ${errorMessage}`);
      }
    } else {
      console.log("User declined to share or no report data.");
    }
  };

  // Loading State integrated into PageLayout
  if (loading) {
    return (
      <PageLayout>
        <div className="w-full h-96 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
          <h2 className="text-2xl font-semibold">Loading Report...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the details of your assessment.</p>
      </div>
      </PageLayout>
    );
  }

  // Error State integrated into PageLayout
  if (error) {
    return (
      <PageLayout>
        <div className="w-full max-w-2xl mx-auto my-12 bg-card/80 backdrop-blur-md rounded-xl shadow-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-500 mb-2">Failed to Load Report</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/report">
              <button className="px-6 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">
                Back to History
          </button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Not Found State integrated into PageLayout
  if (!reportData) {
    return (
      <PageLayout>
        <div className="w-full max-w-2xl mx-auto my-12 bg-card/80 backdrop-blur-md rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn&apos;t find the report you&apos;re looking for.</p>
           <Link href="/report">
              <button className="px-6 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">
                Back to History
          </button>
          </Link>
      </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
       {/* Main content is now children of PageLayout, no need for custom nav/footer */}
      <main className="w-full space-y-8">
        <header className="p-6 md:p-8 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">Health Assessment Report</h1>
              <p className="text-sm text-muted-foreground">
                Assessment ID: {reportData.assessmentId} | Submitted: {new Date(reportData.submittedAt).toLocaleDateString()}
              </p>
            </div>
            <div className={`mt-4 md:mt-0 px-4 py-2 rounded-lg text-center ${riskBgColors[reportData.riskLevel]} ${riskColors[reportData.riskLevel]}`}>
              <span className="font-semibold block text-sm">Overall Risk</span>
              <span className="font-bold text-2xl">{reportData.riskLevel} ({reportData.riskScore}%)</span>
            </div>
          </div>
          <p className="text-foreground/90 mt-2 text-lg">{reportData.summary}</p>
        </header>

        {/* Detailed Report Sections */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Key Metrics and Pie Chart on the left */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-foreground/90 flex items-center"><PieChartIcon className="w-5 h-5 mr-3 text-primary"/>Risk Overview</h3>
                <RiskPieChart score={reportData.riskScore} />
            </div>

            <div className="p-6 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-foreground/90">Key Health Indicators</h3>
              <ul className="space-y-3 text-md">
                {reportData.detailedReport.bloodPressure && (
                  <li className="flex justify-between items-center">
                    <span className="text-muted-foreground">Blood Pressure:</span> 
                    <span className={`font-semibold ${reportData.detailedReport.bloodPressure.status === 'Normal' ? 'text-green-500' : 'text-yellow-400'}`}>{reportData.detailedReport.bloodPressure.value}</span>
                  </li>
                )}
                {reportData.detailedReport.cholesterol && (
                   <li className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cholesterol:</span> 
                    <span className={`font-semibold ${reportData.detailedReport.cholesterol.status === 'Normal' ? 'text-green-500' : 'text-yellow-400'}`}>{reportData.detailedReport.cholesterol.value}</span>
                  </li>
                )}
                {reportData.detailedReport.dietQuality && (
                  <li className="flex justify-between items-center"><span className="text-muted-foreground">Diet Quality:</span> <span className="font-semibold">{reportData.detailedReport.dietQuality}</span></li>
                )}
                {reportData.detailedReport.activityLevel && (
                  <li className="flex justify-between items-center"><span className="text-muted-foreground">Activity Level:</span> <span className="font-semibold">{reportData.detailedReport.activityLevel}</span></li>
                )}
                {reportData.detailedReport.lifestyleFactors?.map(factor => (
                   <li key={factor.factor} className="flex justify-between items-center">
                     <span className="text-muted-foreground">{factor.factor}:</span> 
                     <span className={`font-semibold ${factor.impact === 'Positive' ? 'text-green-500' : 'text-red-500'}`}>{factor.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bar Chart for Risk Breakdown on the right */}
          {reportData.detailedReport.chartsData?.categoryBreakdown && (
            <div className="lg:col-span-3">
              <TrendsBarChart data={reportData.detailedReport.chartsData.categoryBreakdown} title="Risk Factor Breakdown" />
            </div>
          )}
        </section>

        {/* Contextual Interpretation/Recommendations Summary */}
        <section className="p-6 md:p-8 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-3 text-primary">Understanding Your Results</h2>
          <div className="prose prose-invert max-w-none prose-p:text-foreground/80">
            <p>
            This report provides a snapshot of your health based on the information you provided. 
            A <span className={`font-semibold ${riskColors[reportData.riskLevel]}`}>{reportData.riskLevel} risk</span> suggests areas where lifestyle changes might be beneficial.
            {reportData.riskLevel === 'High' && " It is strongly recommended to discuss these results with a healthcare professional."}
            {reportData.riskLevel === 'Medium' && " Consider discussing these results with a healthcare professional for further guidance."}
          </p>
          </div>
          <Link href={`/recommendations?assessmentId=${assessmentId}`}>
             <button className="mt-4 inline-flex items-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                View Personalized Recommendations
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
          </Link>
        </section>
        
        {/* Data Sharing Section */}
        <section className="p-6 md:p-8 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-primary flex items-center"><Share2 className="w-6 h-6 mr-3"/>Share Your Report</h2>
              <p className="text-muted-foreground max-w-2xl">
                Share this assessment with a medical professional for review to help them understand your current health status better.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
          {reportData.isSharedWithProfessional ? (
              <div className="flex items-center p-3 bg-green-900/60 rounded-lg text-green-300">
                <ShieldCheck className="w-6 h-6 mr-3"/>
                <p className="font-semibold">Report is shared</p>
            </div>
          ) : (
              <button 
                onClick={() => setShowConsentModal(true)} 
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                Share with Professional
              </button>
          )}
            </div>
          </div>
        </section>
      </main>

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full mx-2 border border-border/20">
            <h3 className="text-xl font-semibold mb-4 text-primary">Consent to Share Data</h3>
            <div className="prose prose-sm prose-invert max-w-none prose-p:text-foreground/80 mb-6">
              <p>
                You are about to share your assessment results, which includes personal inputs, risk scores, and generated recommendations. This data will be made accessible to a medical professional for review and potential follow-up care.
              </p>
              <p>Do you consent to this sharing?</p>
            </div>
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
    </PageLayout>
  );
};

export default ReportDetailsView; 