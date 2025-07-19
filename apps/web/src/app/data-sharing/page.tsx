'use client';

import React, { useState, useEffect } from 'react';
import { Share2, ShieldCheck, Loader2, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import PageLayout from '@/components/layout/page-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { useAuth } from '../../providers/auth-provider'; // Import useAuth
import { v4 as uuidv4 } from 'uuid'; // Import uuid

interface AssessmentSummary {
  id: string; // MongoDB _id of the assessment
  assessmentId: string; // Frontend generated UUID
  timestamp: string;
  riskScores: { level: string; score: number };
}

interface SharedDataItem {
  _id: string;
  sharedDataId: string;
  userId: string;
  assessmentIds: string[];
  consentGiven: boolean;
  pdfGenerated: boolean;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const DataSharingPage = () => {
  const { user } = useAuth();
  const [availableAssessments, setAvailableAssessments] = useState<AssessmentSummary[]>([]);
  const [selectedAssessmentIds, setSelectedAssessmentIds] = useState<string[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sharedDataHistory, setSharedDataHistory] = useState<SharedDataItem[]>([]);

  useEffect(() => {
    const fetchAssessmentsAndSharedData = async () => {
      if (!user) {
        setError('Please log in to manage data sharing.');
        return;
      }
      try {
        // Fetch available assessments
        const assessmentsResponse = await fetch(`/api/assessments/firebase/${user.uid}`);
        if (!assessmentsResponse.ok) {
          throw new Error(`Failed to fetch assessments: ${assessmentsResponse.status}`);
        }
        const assessmentsData = await assessmentsResponse.json();
        setAvailableAssessments(assessmentsData.map((item: any) => ({ // Assuming item._id exists from backend
          id: item._id,
          assessmentId: item.assessmentId,
          timestamp: item.createdAt,
          riskScores: item.riskScores.diabetes ? { level: item.riskScores.diabetes.level, score: item.riskScores.diabetes.score } : { level: 'Low', score: 0 }, // Fallback
        })));

        // Fetch shared data history
        const sharedDataResponse = await fetch(`/api/data-sharing?userId=${user.uid}`);
        if (!sharedDataResponse.ok) {
            throw new Error(`Failed to fetch shared data history: ${sharedDataResponse.status}`);
        }
        const sharedData = await sharedDataResponse.json();
        setSharedDataHistory(sharedData);

      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(`Failed to load data: ${errorMessage}`);
        console.error("Error fetching data:", e);
      }
    };

    fetchAssessmentsAndSharedData();
  }, [user]);

  const handleCheckboxChange = (assessmentId: string, checked: boolean) => {
    setSelectedAssessmentIds(prev =>
      checked ? [...prev, assessmentId] : prev.filter(id => id !== assessmentId)
    );
  };

  const handleShare = async () => {
    if (!consentGiven) {
      alert('Please provide consent to share your data.');
      return;
    }
    if (selectedAssessmentIds.length === 0) {
      alert('Please select at least one assessment to share.');
      return;
    }
    if (!user) {
        alert('User not authenticated. Please log in.');
        return;
    }

    setIsSharing(true);
    setError(null);
    setShowSuccess(false);

    try {
      const response = await fetch('/api/data-sharing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid, // Firebase UID
          sharedDataId: uuidv4(), // Generate a unique ID for this sharing event
          assessmentIds: selectedAssessmentIds,
          consentGiven: consentGiven,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Share successful:', result);
      setShowSuccess(true);
      // Optionally, refresh shared data history
      // fetchAssessmentsAndSharedData(); // You might want to re-fetch or add the new item to history state
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Failed to share data: ${errorMessage}`);
      console.error("Error sharing data:", e);
    } finally {
    setIsSharing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center p-4">
        <PartyPopper className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Sharing Successful</h1>
        <p className="text-muted-foreground max-w-md mb-6">
          Your selected health data has been securely shared with your registered healthcare provider.
        </p>
        <Button onClick={() => setShowSuccess(false)}>Share More Data</Button>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Data Sharing & Reports</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Securely share your health assessment data with healthcare providers or export it for your records.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                      <Share2 className="w-8 h-8 text-primary" />
                  </div>
              </div>
              <CardTitle className="text-center text-2xl">Share with a Provider</CardTitle>
              <CardDescription className="text-center">
                Generate a secure, temporary link to share a snapshot of your latest health assessment.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              {error && <p className="text-destructive text-center mb-4">{error}</p>}
              {availableAssessments.length === 0 && !user ? (
                <p className="text-muted-foreground text-center">Please log in to view and share your assessments.</p>
              ) : availableAssessments.length === 0 ? (
                <p className="text-muted-foreground text-center">No assessments available to share. Complete an assessment first.</p>
              ) : (
                <div className="space-y-4 mb-6">
                  <p className="text-sm text-muted-foreground">Select assessments to share:</p>
                  {availableAssessments.map(assessment => (
                    <div key={assessment.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`assessment-${assessment.id}`}
                        checked={selectedAssessmentIds.includes(assessment.id)}
                        onCheckedChange={(checked) => handleCheckboxChange(assessment.id, !!checked)}
                      />
                      <Label htmlFor={`assessment-${assessment.id}`}>
                        Assessment on {new Date(assessment.timestamp).toLocaleDateString()} (Risk: {assessment.riskScores.level} - {assessment.riskScores.score}%)
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center space-x-2 mb-6">
                <Switch
                  id="consent-switch"
                  checked={consentGiven}
                  onCheckedChange={setConsentGiven}
                />
                <Label htmlFor="consent-switch" className="text-sm text-muted-foreground">
                  I consent to sharing my selected health data.
                </Label>
              </div>
              <Button onClick={handleShare} disabled={isSharing || !consentGiven || selectedAssessmentIds.length === 0}>
                {isSharing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sharing...</>
                ) : (
                  <><Share2 className="mr-2 h-4 w-4" /> Generate Secure Link</>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
               <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                      <FileText className="w-8 h-8 text-primary" />
                  </div>
              </div>
              <CardTitle className="text-center text-2xl">Export as PDF</CardTitle>
              <CardDescription className="text-center">
                Download a comprehensive PDF report of your health data for offline access or printing.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center">
               <p className="text-sm text-muted-foreground mb-4">This feature is coming soon.</p>
              <Button disabled>Download PDF Report</Button>
            </CardContent>
          </Card>
        </div>

        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-center">Shared Data History</h3>
          {sharedDataHistory.length === 0 ? (
            <div className="text-center py-8 bg-card/50 rounded-xl">
              <p className="text-muted-foreground">No data has been shared yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sharedDataHistory.map(item => (
                <Card key={item._id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Shared on: {new Date(item.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">Assessments Shared: {item.assessmentIds.length}</p>
                    {item.pdfGenerated && item.pdfUrl && (
                      <Link href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center mt-1">
                        <FileText className="w-4 h-4 mr-1" /> View PDF
                      </Link>
                    )}
                  </div>
                  <ShieldCheck className="w-6 h-6 text-green-500" title="Consent Given" />
                </Card>
              ))}
            </div>
          )}
        </section>

        <div className="mt-12 text-center text-muted-foreground text-sm">
            <p className='font-semibold'>Your privacy is our priority.</p>
            <p>
                Data is only shared when you explicitly choose to, and all exports are handled securely.
            </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default DataSharingPage; 