'use client';

import React from 'react';
import { AssessmentData } from '@shared/types/assessment';

const RiskScoreCard: React.FC<{
  title: string;
  score: number;
  description: string;
}> = ({ title, score, description }) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className={`text-3xl font-bold mb-2 ${getScoreColor(score)}`}>
        {score}%
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const RecommendationCard: React.FC<{
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}> = ({ title, description, priority }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
            priority
          )}`}
        >
          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
        </span>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default function ReportPage() {
  // Mock data - replace with actual API call
  const assessmentData: AssessmentData = {
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
      hypertension: 30,
      overall: 20,
    },
    recommendations: [
      {
        title: 'Increase Physical Activity',
        description: 'Aim for at least 30 minutes of moderate exercise daily.',
        priority: 'high',
      },
      {
        title: 'Improve Sleep Habits',
        description: 'Maintain a consistent sleep schedule and aim for 7-8 hours of sleep.',
        priority: 'medium',
      },
      {
        title: 'Reduce Processed Food Intake',
        description: 'Limit consumption of processed foods and increase whole food intake.',
        priority: 'medium',
      },
    ],
    status: 'completed',
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assessment Report</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RiskScoreCard
          title="Diabetes Risk"
          score={assessmentData.riskScores.diabetes}
          description="Based on your current health indicators"
        />
        <RiskScoreCard
          title="Heart Disease Risk"
          score={assessmentData.riskScores.heartDisease}
          description="Based on your current health indicators"
        />
        <RiskScoreCard
          title="Hypertension Risk"
          score={assessmentData.riskScores.hypertension}
          description="Based on your current health indicators"
        />
        <RiskScoreCard
          title="Overall Risk"
          score={assessmentData.riskScores.overall}
          description="Combined risk assessment"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessmentData.recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={index}
              title={recommendation.title}
              description={recommendation.description}
              priority={recommendation.priority}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 