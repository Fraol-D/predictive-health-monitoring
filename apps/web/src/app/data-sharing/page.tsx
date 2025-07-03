'use client';

import React, { useState } from 'react';
import { Share2, ShieldCheck, Loader2, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import PageLayout from '@/components/layout/page-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

const DataSharingPage = () => {
  const [shareOptions, setShareOptions] = useState({
    'Demographics': true,
    'Diet Information': true,
    'Lifestyle Habits': true,
    'Medical History & Symptoms': true,
    'Vital Signs': false,
  });
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleShare = async () => {
    if (!consentGiven) {
      alert('Please provide consent to share your data.');
      return;
    }
    setIsSharing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    setIsSharing(false);
    setShowSuccess(true);
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
            <CardContent className="flex-grow flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground mb-4">This feature is coming soon.</p>
              <Button disabled>Generate Secure Link</Button>
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