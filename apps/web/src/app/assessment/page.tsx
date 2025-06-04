'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Step1Demographics from '@/components/assessment/steps/Step1Demographics';
import Step2Diet from '@/components/assessment/steps/Step2Diet';
import Step3Lifestyle from '@/components/assessment/steps/Step3Lifestyle';
import { DietData, LifestyleData } from '@shared/types/assessment';
import { AssessmentStepper } from '@/components/assessment/assessment-stepper';
import { DietForm } from '@/components/assessment/diet-form';
import { LifestyleForm } from '@/components/assessment/lifestyle-form';
import { MedicalHistoryForm } from '@/components/assessment/medical-history-form';
import { VitalSignsForm } from '@/components/assessment/vital-signs-form';
import { AssessmentData, AssessmentStep } from '@shared/types/assessment';

// Define types for form data
interface Step1Data {
  age: string;
  sex: string;
  weight: string;
  weightUnit: 'kg' | 'lbs';
}

interface AssessmentFormData {
  step1?: Step1Data;
  step2?: DietData;
  step3?: LifestyleData;
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

  const handleDataChange = (stepId: string, data: any) => {
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
    // Mark all steps as completed for UI, though data is already in assessmentData
    const completedSteps = assessmentSteps.map(s => ({ ...s, isCompleted: true }));
    // Update assessment status
    setAssessmentData(prev => ({
      ...prev,
      status: 'completed',
      timestamp: new Date().toISOString(), // Update timestamp on completion
    }));
    console.log('Assessment completed:', assessmentData); // Log the final data
    
    // Trigger the completion view
    setDirection(1); // Ensure forward animation to completion view
    setCurrentStep(assessmentSteps.length);
  };

  const renderCurrentStepComponent = () => {
    const stepConfig = assessmentSteps[currentStep];
    if (!stepConfig) return <p>Step not found.</p>; // Should not happen

    const commonProps = {
      onNext: handleNext,
      onBack: handleBack,
      // It's better for each form to manage its own part of assessmentData
      // So we pass a specific slice and a dedicated updater
    };

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white dark:from-background dark:to-background/80 dark:text-foreground flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl text-center bg-card/80 dark:bg-card/70 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-2xl">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="mb-8"
            >
                <svg className="w-24 h-24 text-green-500 dark:text-green-400 mx-auto" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </motion.div>
            <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-300 dark:to-emerald-400"
            >
                Assessment Complete!
            </motion.h2>
            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", delay: 0.6 }}
                className="text-lg text-slate-300 dark:text-muted-foreground mb-8"
            >
                Thank you for completing your health assessment. Your results are being processed.
            </motion.p>
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", delay: 0.8 }}
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
                <Link href="/assessment/report">
                    <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                        View Report
                    </button>
                </Link>
                <Link href="/">
                    <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                        Back to Home
                    </button>
                </Link>
            </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white dark:bg-background dark:text-foreground flex flex-col items-center justify-center p-4 md:p-8">
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
          <p className="text-slate-300 dark:text-gray-300 text-md">{assessmentSteps[currentStep]?.description}</p>
        </motion.header>

        <main className="p-6 md:p-8 bg-slate-800/50 dark:bg-card/50 backdrop-blur-lg rounded-xl shadow-2xl min-h-[450px] relative overflow-hidden border border-slate-700/50">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep} // Ensure this key changes to trigger AnimatePresence
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute top-0 left-0 right-0 bottom-0 p-3 md:p-6" // Added padding
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