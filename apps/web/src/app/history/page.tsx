import React from 'react';
import Link from 'next/link';
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
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Moderate Risk';
    return 'High Risk';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Assessment #{assessment.id}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(assessment.timestamp).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(
            assessment.riskScores.overall
          )}`}
        >
          {getRiskLevelText(assessment.riskScores.overall)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Diabetes Risk</p>
          <p className={`text-lg font-semibold ${getRiskLevelColor(assessment.riskScores.diabetes)}`}>
            {assessment.riskScores.diabetes}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Heart Disease Risk</p>
          <p
            className={`text-lg font-semibold ${getRiskLevelColor(
              assessment.riskScores.heartDisease
            )}`}
          >
            {assessment.riskScores.heartDisease}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hypertension Risk</p>
          <p
            className={`text-lg font-semibold ${getRiskLevelColor(
              assessment.riskScores.hypertension
            )}`}
          >
            {assessment.riskScores.hypertension}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Overall Risk</p>
          <p
            className={`text-lg font-semibold ${getRiskLevelColor(
              assessment.riskScores.overall
            )}`}
          >
            {assessment.riskScores.overall}%
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href={`/assessment/report?id=${assessment.id}`}
          className="text-primary hover:text-primary-dark font-medium"
        >
          View Full Report →
        </Link>
      </div>
    </div>
  );
};

export default function HistoryPage() {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Assessment History
          </h1>
          <Link
            href="/assessment"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
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