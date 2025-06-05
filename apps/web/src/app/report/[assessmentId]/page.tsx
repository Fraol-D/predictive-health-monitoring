'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import PageLayout from '@/components/layout/page-layout';
import { Heart, Droplet, Zap, CheckCircle } from 'lucide-react';

// Mock data fetching function - in a real app, this would fetch from your API
const getAssessmentById = (id: string) => {
  if (!id) return null;
  // In a real app, you'd fetch data based on the id.
  // For now, we return the same mock data regardless of id.
  return {
    id: id,
    timestamp: '2023-10-28T10:00:00Z',
    riskScores: {
      diabetes: { score: 70, level: 'High', description: 'Your glucose levels and lifestyle factors indicate a high risk for developing diabetes.' },
      hypertension: { score: 60, level: 'Medium', description: 'Your blood pressure readings are slightly elevated, suggesting a medium risk.' },
      heartDisease: { score: 30, level: 'Low', description: 'Your cardiovascular indicators appear healthy, suggesting a low immediate risk.' },
    },
    recommendations: [
      { id: 1, title: 'Dietary Adjustments', description: 'Reduce intake of sugary drinks and processed carbohydrates. Focus on whole grains and lean proteins.', priority: 'High' },
      { id: 2, title: 'Increase Physical Activity', description: 'Incorporate at least 30 minutes of moderate cardio, such as brisk walking or cycling, 5 days a week.', priority: 'High' },
      { id: 3, title: 'Regular Monitoring', description: 'Monitor your blood pressure at home once a week and schedule a follow-up with your doctor in 3 months.', priority: 'Medium' },
    ]
  };
};

const RiskScoreCard = ({ icon, title, score, level, description }: { icon: React.ReactNode, title: string, score: number, level: string, description: string }) => {
    const getRiskStyling = (level: string) => {
        switch (level) {
            case 'High':
            case 'Very High':
            return {
                bg: 'bg-red-500/10',
                text: 'text-red-400',
                border: 'border-red-500/30',
                shadow: 'hover:shadow-red-500/20'
            };
            case 'Medium':
            return {
                bg: 'bg-yellow-500/10',
                text: 'text-yellow-400',
                border: 'border-yellow-500/30',
                shadow: 'hover:shadow-yellow-500/20'
            };
            case 'Low':
            default:
            return {
                bg: 'bg-green-500/10',
                text: 'text-green-400',
                border: 'border-green-500/30',
                shadow: 'hover:shadow-green-500/20'
            };
        }
    };
    const { bg, text, border, shadow } = getRiskStyling(level);

    return (
        <div className={`bg-card/70 backdrop-blur-md p-6 rounded-xl shadow-lg transition-all duration-300 border ${border} ${shadow}`}>
            <div className="flex items-center mb-4">
                <div className={`p-2 rounded-full mr-4 ${bg} ${text}`}>{icon}</div>
                <h3 className={`text-xl font-semibold ${text}`}>{title}</h3>
            </div>
            <div className="text-center my-4">
                <p className={`text-6xl font-bold ${text}`}>{score}%</p>
                <p className={`text-lg font-semibold mt-2 ${text}`}>{level} Risk</p>
            </div>
            <p className="text-muted-foreground text-center">{description}</p>
        </div>
    );
};

const RecommendationItem = ({ title, description, priority }: { title: string, description: string, priority: string }) => {
    const getPriorityStyling = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'text-red-400 bg-red-500/10';
            case 'Medium':
                return 'text-yellow-400 bg-yellow-500/10';
            default:
                return 'text-green-400 bg-green-500/10';
        }
    };

    return (
        <div className="bg-card/50 p-5 rounded-lg border border-border/20 flex items-start justify-between">
             <div className="flex items-start">
                <div className="p-2 bg-primary/20 text-primary rounded-full mr-4">
                    <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-semibold text-lg">{title}</h4>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
            <span className={`ml-4 px-3 py-1 text-sm font-semibold rounded-full whitespace-nowrap ${getPriorityStyling(priority)}`}>
                {priority} Priority
            </span>
        </div>
    )
}

export default function DetailedReportPage({ params }: { params: { assessmentId: string } }) {
  const assessment = getAssessmentById(params.assessmentId);

  if (!assessment) {
    notFound();
  }

  return (
    <PageLayout>
      <header className="w-full mb-12">
        <h2 className="text-4xl font-bold mb-2">Assessment Report Details</h2>
        <p className="text-xl text-muted-foreground">
          Generated on {new Date(assessment.timestamp).toLocaleDateString('en-US', { dateStyle: 'full' })}
        </p>
      </header>

      {/* Risk Scores Section */}
      <section className="w-full mb-12">
        <h3 className="text-3xl font-semibold mb-6 text-center">Your Risk Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <RiskScoreCard icon={<Droplet />} title="Diabetes" {...assessment.riskScores.diabetes} />
            <RiskScoreCard icon={<Zap />} title="Hypertension" {...assessment.riskScores.hypertension} />
            <RiskScoreCard icon={<Heart />} title="Heart Disease" {...assessment.riskScores.heartDisease} />
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="w-full">
        <h3 className="text-3xl font-semibold mb-6 text-center">Personalized Recommendations</h3>
        <div className="max-w-4xl mx-auto space-y-6">
            {assessment.recommendations.map((rec) => (
                <RecommendationItem key={rec.id} {...rec} />
            ))}
        </div>
      </section>
    </PageLayout>
  );
} 