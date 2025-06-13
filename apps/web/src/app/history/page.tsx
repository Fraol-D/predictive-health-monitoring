'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AssessmentData } from '@shared/types/assessment';

interface AssessmentCardProps {
  assessment: AssessmentData;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment }) => {
  const getRiskLevelColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskLevelText = (score: number) => {
    if (score < 30) return 'Low';
    if (score < 70) return 'Moderate';
    return 'High';
  };

  return (
    <div className="bg-card/80 backdrop-blur-md rounded-xl shadow-lg p-6 transition-all hover:shadow-primary/20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            Assessment from {new Date(assessment.timestamp).toLocaleDateString()}
          </h3>
          <p className={`text-lg font-bold ${getRiskLevelColor(assessment.riskScores.overall)}`}>
            {getRiskLevelText(assessment.riskScores.overall)} Risk
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Overall Score</p>
          <p className={`text-3xl font-bold ${getRiskLevelColor(assessment.riskScores.overall)}`}>
            {assessment.riskScores.overall}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 border-t border-border pt-4">
        <div>
          <p className="text-sm text-muted-foreground">Diabetes</p>
          <p className={`text-lg font-semibold ${getRiskLevelColor(assessment.riskScores.diabetes)}`}>
            {assessment.riskScores.diabetes}%
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Heart Disease</p>
          <p
            className={`text-lg font-semibold ${getRiskLevelColor(
              assessment.riskScores.heartDisease
            )}`}
          >
            {assessment.riskScores.heartDisease}%
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Hypertension</p>
          <p
            className={`text-lg font-semibold ${getRiskLevelColor(
              assessment.riskScores.hypertension
            )}`}
          >
            {assessment.riskScores.hypertension}%
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href={`/assessment/report?id=${assessment.id}`}
          className="font-semibold text-primary hover:underline"
        >
          View Full Report →
        </Link>
      </div>
    </div>
  );
};

export default function HistoryPage() {
  const router = useRouter();
  // TODO: Replace with actual data from API
  const assessments: AssessmentData[] = [
    {
      id: '1',
      userId: 'user1',
      timestamp: new Date().toISOString(),
      diet: {
        fruitVegFrequency: 'daily',
        processedFoodFrequency: 'multiple_times_week',
        waterIntakeLiters: 2,
        dietaryRestrictions: [],
        notes: '',
      },
      lifestyle: {
        physicalActivityFrequency: 'multiple_times_week',
        physicalActivityDurationMinutes: 30,
        sleepHoursPerNight: 7,
        stressLevel: 'moderate',
        smokingStatus: 'never',
        alcoholConsumption: 'occasional',
        notes: '',
      },
      medicalHistory: {
        familyHistory: {
          diabetes: false,
          heartDisease: false,
          hypertension: false,
          cancer: false,
          other: [],
        },
        existingConditions: [],
        medications: [],
        allergies: [],
        lastCheckup: new Date().toISOString().split('T')[0],
      },
      vitalSigns: {
        height: 170,
        weight: 70,
        bloodPressure: {
          systolic: 120,
          diastolic: 80,
        },
        bloodSugar: 100,
        heartRate: 72,
      },
      riskScores: {
        diabetes: 25,
        heartDisease: 15,
        hypertension: 20,
        overall: 20,
      },
      recommendations: [
        {
          title: 'Increase Physical Activity',
          description: 'Aim for at least 150 minutes of moderate-intensity exercise per week.',
          priority: 'medium',
        },
        {
          title: 'Improve Sleep Quality',
          description: 'Maintain a consistent sleep schedule and aim for 7-9 hours of sleep per night.',
          priority: 'high',
        },
        {
          title: 'Reduce Processed Food Intake',
          description: 'Limit consumption of processed foods and focus on whole, nutrient-dense foods.',
          priority: 'medium',
        },
      ],
      status: 'completed',
    },
    // Add more sample assessments here
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-foreground">
            Assessment History
          </h1>
          <Link
            href="/assessment"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform"
          >
            New Assessment
          </Link>
        </div>

        <div className="space-y-6">
          {assessments.map((assessment) => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </div>
      </div>
    </div>
  );
}