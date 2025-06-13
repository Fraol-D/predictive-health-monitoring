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
  id: '',
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
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RiskResult | null>(null);

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
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    const finalData = {
      ...assessmentData,
      status: 'completed' as const,
      timestamp: new Date().toISOString(),
    };
    setAssessmentData(finalData);

    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const resultData: RiskResult = await response.json();
      setResult(resultData);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(errorMessage);
      console.error('Assessment submission failed:', e);
    } finally {
      setIsSubmitting(false);
    // Trigger the completion view
      setDirection(1);
    setCurrentStep(assessmentSteps.length);
    }
  };

  const renderCurrentStepComponent = () => {
    const stepConfig = assessmentSteps[currentStep];
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

  // Completion View (if currentStep goes beyond actual data forms)
  if (currentStep >= assessmentSteps.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl text-center bg-card/80 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-2xl">
          {isSubmitting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-t-4 border-t-purple-500 border-gray-600 rounded-full animate-spin mb-4"></div>
              <p className="text-xl font-semibold">Analyzing your data...</p>
              <p className="text-muted-foreground">This may take a moment.</p>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h3>
              <p className="text-muted-foreground mb-6 bg-red-900/50 p-4 rounded-lg">{error}</p>
              <button onClick={() => setCurrentStep(assessmentSteps.length - 1)} className="px-6 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">
                Go Back
              </button>
            </motion.div>
          )}

          {result && (
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <div className="mb-8">
                <svg className="w-24 h-24 text-green-500 dark:text-green-400 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                </div>
                <h3 className="text-3xl font-bold mb-4">Assessment Complete!</h3>
                <p className="text-muted-foreground mb-6">Here are your initial risk scores. A detailed report is available on your dashboard.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
                  <div className="bg-background/50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-400">Diabetes</h4>
                    <p className="text-3xl font-bold">{result.diabetes?.score ?? 'N/A'}%</p>
                    <p className="text-sm text-muted-foreground">{result.diabetes?.level ?? ''}</p>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-pink-400">Hypertension</h4>
                    <p className="text-3xl font-bold">{result.hypertension?.score ?? 'N/A'}%</p>
                    <p className="text-sm text-muted-foreground">{result.hypertension?.level ?? ''}</p>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-teal-400">Heart Disease</h4>
                    <p className="text-3xl font-bold">{result.heartDisease?.score ?? 'N/A'}%</p>
                    <p className="text-sm text-muted-foreground">{result.heartDisease?.level ?? ''}</p>
                  </div>
                </div>
                <Link href="/">
                  <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform">
                    Back to Dashboard
                    </button>
                </Link>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <motion.header 
          initial={{opacity: 0, y: -30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
          className="mb-8 text-center relative"
        >
            <Link href="/" className="text-sm text-purple-400 hover:text-purple-300 absolute top-0 left-0 p-2 md:top-1 md:left-1">
              &larr; Quit Assessment
            </Link>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 pt-10 md:pt-8">
            Health Risk Assessment
          </h1>
          <AssessmentStepper 
            steps={assessmentSteps}
            currentStep={currentStep}
            onStepClick={handleStepClick} 
          />
          {/* Progress bar and step title can be part of AssessmentStepper or here */}
          <p className="text-muted-foreground text-md">{assessmentSteps[currentStep]?.description}</p>
        </motion.header>

        <main className="p-6 md:p-8 bg-card/50 backdrop-blur-lg rounded-xl shadow-2xl min-h-[450px] relative overflow-hidden border border-border/50">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep} // Ensure this key changes to trigger AnimatePresence
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute top-0 left-0 right-0 bottom-0 p-3 md:p-6 overflow-y-auto scrollbar-thin"
            >
              {renderCurrentStepComponent()} 
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AssessmentPage; 