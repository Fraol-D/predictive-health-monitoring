'use client';

import React, { useState } from 'react';
import { Share2, ShieldCheck, Loader2, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

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
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col items-start mb-8">
        <div className="p-3 bg-primary/10 rounded-full mb-4">
          <Share2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Share with Your Provider</h1>
        <p className="text-muted-foreground mt-2">
          Select the categories of health data you wish to share. This information will be sent securely to your healthcare provider.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground tracking-widest">DATA CATEGORIES</h2>
        <div className="p-6 bg-card rounded-xl border">
          <ul className="divide-y divide-border">
            {Object.entries(shareOptions).map(([key, value]) => (
              <li key={key} className="flex items-center justify-between py-4">
                <Label htmlFor={key} className="font-medium text-base">{key}</Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked: boolean) =>
                    setShareOptions((prev) => ({ ...prev, [key]: checked }))
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 p-6 bg-card rounded-xl border flex items-start space-x-4">
        <Checkbox 
            id="consent" 
            checked={consentGiven}
            onCheckedChange={(checked: boolean) => setConsentGiven(checked)}
            className="mt-1"
        />
        <div className="grid gap-1.5 leading-none">
            <label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I consent to share the selected health data with my healthcare provider for medical review.
            </label>
        </div>
      </div>

      <div className="mt-8">
        <Button
          onClick={handleShare}
          disabled={isSharing || !consentGiven}
          className="w-full text-lg font-bold py-7 bg-gradient-to-r from-[#a13de0] to-[#ff5177] text-white hover:opacity-90 transition-opacity"
        >
          {isSharing ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ShieldCheck className="mr-2 h-5 w-5" />
          )}
          {isSharing ? 'SHARING...' : 'Share Data Securely'}
        </Button>
      </div>
    </div>
  );
};

export default DataSharingPage; 