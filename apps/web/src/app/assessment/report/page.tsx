import React from 'react';
import { AssessmentData } from '@shared/types/assessment';

interface RiskScoreCardProps {
  title: string;
  score: number;
  description: string;
}

const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ title, score, description }) => {
  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-green-500 dark:text-green-400';
    if (score < 70) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  return (
    <div className="bg-card/70 dark:bg-card/60 backdrop-blur-md rounded-xl shadow-xl p-6 transform transition-all hover:scale-105 hover:shadow-primary/20">
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-muted-foreground/30 dark:text-muted-foreground/20"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className={getScoreColor(score)}
              strokeWidth="10"
              strokeDasharray={`${score * 2.51} 251.2`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

interface RecommendationCardProps {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  priority,
}) => {
  const getPriorityStyles = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'high':
        return 'bg-red-500/10 dark:bg-red-700/20 text-red-600 dark:text-red-300 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/10 dark:bg-yellow-700/20 text-yellow-600 dark:text-yellow-300 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/10 dark:bg-green-700/20 text-green-600 dark:text-green-300 border-green-500/50';
      default:
        return 'bg-slate-500/10 dark:bg-slate-700/20 text-slate-600 dark:text-slate-300 border-slate-500/50';
    }
  };

  return (
    <div className="bg-card/70 dark:bg-card/60 backdrop-blur-md rounded-xl shadow-xl p-6 transform transition-all hover:shadow-primary/20">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-foreground flex-1">{title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyles(
            priority
          )} border`}
        >
          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
        </span>
      </div>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default function AssessmentReportPage() {
  // TODO: Replace with actual data from API
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
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-0">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 md:mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent pb-2">
            Assessment Report
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Generated on: {new Date(assessmentData.timestamp).toLocaleDateString()}
          </p>
        </header>

        <section className="mb-10 md:mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-center md:text-left text-transparent bg-clip-text bg-gradient-to-r from-secondary to-purple-400">
            Risk Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <RiskScoreCard
              title="Diabetes Risk"
              score={assessmentData.riskScores.diabetes}
              description="Based on your lifestyle, diet, and medical history"
            />
            <RiskScoreCard
              title="Heart Disease Risk"
              score={assessmentData.riskScores.heartDisease}
              description="Based on your vital signs and lifestyle factors"
            />
            <RiskScoreCard
              title="Hypertension Risk"
              score={assessmentData.riskScores.hypertension}
              description="Based on your blood pressure and lifestyle"
            />
            <RiskScoreCard
              title="Overall Health Risk"
              score={assessmentData.riskScores.overall}
              description="Combined risk assessment across all factors"
            />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6 text-center md:text-left text-transparent bg-clip-text bg-gradient-to-r from-secondary to-pink-400">
            Personalized Recommendations
          </h2>
          <div className="space-y-6">
            {assessmentData.recommendations.map((recommendation, index) => (
              <RecommendationCard
                key={index}
                title={recommendation.title}
                description={recommendation.description}
                priority={recommendation.priority}
              />
            ))}
          </div>
        </section>

        <div className="mt-10 md:mt-12 flex justify-center md:justify-end">
          <button
            onClick={() => window.print()}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
} 