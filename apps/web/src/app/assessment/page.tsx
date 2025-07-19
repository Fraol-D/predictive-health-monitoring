'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AssessmentStepper } from '@/components/assessment/assessment-stepper';
import { DietForm } from '@/components/assessment/diet-form';
import { LifestyleForm } from '@/components/assessment/lifestyle-form';
import { MedicalHistoryForm } from '@/components/assessment/medical-history-form';
import { VitalSignsForm } from '@/components/assessment/vital-signs-form';
import { AssessmentData, AssessmentStep } from '@shared/types/assessment';
import { useAuth } from '../../providers/auth-provider'; // Import useAuth
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Define types for form data and API results
interface RiskInfo {
  score: number;
  level: 'Low' | 'Medium' | 'High' | 'Very High';
  description: string;
}

interface RiskResult {
  diabetes: RiskInfo;
  hypertension: RiskInfo;
  heartDisease: RiskInfo;
}

const stepVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { type: "tween", ease: "anticipate", duration: 0.6 },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    transition: { type: "tween", ease: "anticipate", duration: 0.6 },
  }),
};

const initialAssessmentData: AssessmentData = {
  id: uuidv4(), // Generate a unique ID for the assessment
  userId: '', // This will be set when the user is authenticated
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
    diabetes: 0,
    heartDisease: 0,
    hypertension: 0,
    overall: 0,
  },
  recommendations: [],
  status: 'draft',
};

const assessmentSteps: AssessmentStep[] = [
  {
    id: 'diet',
    title: 'Diet',
    description: 'Tell us about your eating habits',
    component: 'diet',
    isCompleted: false,
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    description: 'Share your daily activities and habits',
    component: 'lifestyle',
    isCompleted: false,
  },
  {
    id: 'medical-history',
    title: 'Medical History',
    description: 'Provide your medical background',
    component: 'medical-history',
    isCompleted: false,
  },
  {
    id: 'vital-signs',
    title: 'Vital Signs',
    description: 'Enter your current measurements',
    component: 'vital-signs',
    isCompleted: false,
  },
];

const AssessmentPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>(initialAssessmentData);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Get the current authenticated user
  const router = useRouter();

  // Ensure userId is set once the user is available
  React.useEffect(() => {
    if (user && !assessmentData.userId) {
      setAssessmentData(prev => ({
        ...prev,
        userId: user.uid, // Use Firebase UID as the userId for now, will map to MongoDB _id in API route
      }));
    }
  }, [user, assessmentData.userId]);

  const handleDataChange = (stepId: string, data: Partial<AssessmentData[keyof AssessmentData]>) => {
    setAssessmentData(prev => ({
      ...prev,
      [stepId]: data,
    }));
  };

  const handleNext = () => {
    if (currentStep < assessmentSteps.length - 1) {
    setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      handleAssessmentComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep) {
    setDirection(-1);
    } else if (stepIndex > currentStep) {
      setDirection(1);
    }
    setCurrentStep(stepIndex);
  };

  const handleAssessmentComplete = async () => {
    if (!user) {
      toast.error('User not authenticated. Please log in.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    let savedAssessment;

    // Calculate basic risk scores (simplified for now)
    const calculateRiskScores = (data: AssessmentData) => {
      const riskScores: RiskResult = {
        diabetes: { score: 0, level: 'Low', description: 'Low risk based on current data' },
        heartDisease: { score: 0, level: 'Low', description: 'Low risk based on current data' },
        hypertension: { score: 0, level: 'Low', description: 'Low risk based on current data' },
      };

      // Simple risk calculation based on vitals and lifestyle
      let totalRisk = 0;
      
      // Blood pressure risk
      if (
        data.vitalSigns.bloodPressure &&
        (data.vitalSigns.bloodPressure.systolic > 140 || data.vitalSigns.bloodPressure.diastolic > 90)
      ) {
        riskScores.hypertension.score = 70;
        riskScores.hypertension.level = 'High';
        riskScores.hypertension.description = 'High blood pressure detected';
        totalRisk += 30;
      }

      // Heart rate risk
      if (
        typeof data.vitalSigns.heartRate === 'number' &&
        (data.vitalSigns.heartRate > 100 || data.vitalSigns.heartRate < 60)
      ) {
        riskScores.heartDisease.score = 40;
        riskScores.heartDisease.level = 'Medium';
        riskScores.heartDisease.description = 'Irregular heart rate detected';
        totalRisk += 20;
      }

      // Lifestyle risk factors
      if (
        data.lifestyle.smokingStatus === 'current_light' ||
        data.lifestyle.smokingStatus === 'current_heavy'
      ) {
        totalRisk += 25;
      }
      if (data.lifestyle.alcoholConsumption === 'heavy') {
        totalRisk += 15;
      }
      if (data.lifestyle.physicalActivityFrequency === 'never') {
        totalRisk += 20;
      }

      const overall = Math.min(totalRisk, 100);
      return { ...riskScores, overall };
    };

    const finalData = {
      firebaseUID: user.uid, // Pass firebaseUID for backend processing
      assessmentId: assessmentData.id,
      fullAssessmentData: {
      ...assessmentData,
      status: 'completed' as const,
      timestamp: new Date().toISOString(),
      },
      riskScores: calculateRiskScores(assessmentData),
    };

    try {
      // Get Firebase ID token
      const token = await user.getIdToken();
      // Step 1: Save the assessment
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to save assessment.');
      }

      savedAssessment = await response.json();
      toast.success('Assessment submitted successfully!');

      // Step 2: Trigger AI insight generation
      setIsSubmitting(false); // Done with initial submission
      setIsGenerating(true);  // Now generating insights
      toast.loading('Generating your personalized health report...');
      
      const insightsResponse = await fetch('/api/insights/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ assessmentId: savedAssessment._id, firebaseUID: user.uid }),
      });

      toast.dismiss(); // Dismiss loading toast

      if (!insightsResponse.ok) {
        const errorData = await insightsResponse.json();
        throw new Error(errorData.error || 'Failed to generate insights.');
      }
      
      toast.success('Report generated successfully! Redirecting...');
      router.push(`/report`); // Redirect to the main reports list page

    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Assessment process failed:', err);
    } finally {
      setIsSubmitting(false);
      setIsGenerating(false);
    }
  };

  const renderCurrentStepComponent = () => {
    const stepConfig = assessmentSteps[currentStep];
    if (isSubmitting || isGenerating) {
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">
              {isSubmitting ? 'Submitting your assessment...' : 'Generating your personalized health report...'}
            </p>
          </div>
        );
    }
    if (!stepConfig) return <p>Step not found.</p>; // Should not happen

    switch (stepConfig.component) {
      case 'diet':
        return (
          <DietForm
            data={assessmentData.diet} // Pass the 'diet' part of the state
            onChange={(data) => handleDataChange('diet', data)} // Update the 'diet' part
            onNext={handleNext}
            onBack={handleBack} // DietForm is the first, might not need onBack
          />
        );
      case 'lifestyle':
        return (
          <LifestyleForm
            data={assessmentData.lifestyle}
            onChange={(data) => handleDataChange('lifestyle', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'medical-history':
        return (
          <MedicalHistoryForm
            data={assessmentData.medicalHistory}
            onChange={(data) => handleDataChange('medicalHistory', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'vital-signs':
        return (
          <VitalSignsForm
            data={assessmentData.vitalSigns}
            onChange={(data) => handleDataChange('vitalSigns', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return <p>Unknown step component: {stepConfig.component}</p>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
          <AssessmentStepper 
            steps={assessmentSteps}
            currentStep={currentStep}
            onStepClick={handleStepClick} 
          />
        <div className="mt-8 bg-card/50 backdrop-blur-sm p-6 md:p-10 rounded-xl shadow-lg border border-border/20">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderCurrentStepComponent()} 
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage; 