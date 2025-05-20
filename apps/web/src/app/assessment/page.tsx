'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Step1Demographics from '@/components/assessment/steps/Step1Demographics';
import Step2Diet from '@/components/assessment/steps/Step2Diet';
import Step3Lifestyle from '@/components/assessment/steps/Step3Lifestyle';
import { DietData, LifestyleData } from '@shared/types/assessment';

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

const AssessmentPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<AssessmentFormData>({});
  const [direction, setDirection] = useState(1);

  const handleNextStep = (stepData: Partial<AssessmentFormData>) => {
    setDirection(1);
    setFormData((prev: AssessmentFormData) => ({ ...prev, ...stepData }));
    setCurrentStep((prev: number) => prev + 1);
  };

  const handlePrevStep = () => {
    setDirection(-1);
    if (currentStep > 1) {
      setCurrentStep((prev: number) => prev - 1);
    }
  };

  const totalSteps = 3;
  let currentStepTitle = 'Basic Information';
  if (currentStep === 2) currentStepTitle = 'Dietary Habits';
  if (currentStep === 3) currentStepTitle = 'Lifestyle Factors';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white dark:bg-background dark:text-foreground flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <motion.header 
          initial={{opacity: 0, y: -30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
          className="mb-8 text-center relative"
        >
          {currentStep <= totalSteps && (
            <Link href="/" className="text-sm text-purple-400 hover:text-purple-300 absolute top-0 left-0 p-2 md:top-1 md:left-1">
              &larr; Quit Assessment
            </Link>
          )}
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 pt-10 md:pt-8">
            Health Risk Assessment
          </h1>
          {currentStep <= totalSteps && (
            <>
              <div className="w-full bg-slate-700/50 dark:bg-gray-700/50 rounded-full h-2.5 mt-4 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
              <p className="text-slate-300 dark:text-gray-300 text-md">Step {currentStep} of {totalSteps} - {currentStepTitle}</p>
            </>
          )}
        </motion.header>

        <main className="p-6 md:p-8 bg-slate-800/50 dark:bg-card/50 backdrop-blur-lg rounded-xl shadow-2xl min-h-[450px] relative overflow-hidden border border-slate-700/50">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute top-0 left-0 right-0 bottom-0 p-1 md:p-3"
            >
              {currentStep === 1 && 
                <Step1Demographics 
                  onNext={(data) => handleNextStep({ step1: data })}
                  initialData={formData.step1}
                />
              }
              {currentStep === 2 && 
                <Step2Diet 
                  onNext={(data) => handleNextStep({ step2: data })}
                  onPrev={handlePrevStep}
                  initialData={formData.step2}
                />
              }
              {currentStep === 3 && currentStep <= totalSteps && (
                <Step3Lifestyle 
                  onNext={(data) => handleNextStep({ step3: data })}
                  onPrev={handlePrevStep}
                  initialData={formData.step3}
                />
              )}

              {currentStep > totalSteps && (
                <div className="text-center p-6 flex flex-col items-center justify-center h-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <svg className="w-20 h-20 text-green-400 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </motion.div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-semibold mb-4 text-green-300"
                  >
                    Assessment Complete!
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-200 dark:text-gray-200 mb-6"
                  >
                    Thank you for providing your information. Your results will be available soon.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link 
                      href="/" 
                      className="mt-6 inline-block px-8 py-3.5 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold shadow-xl transform hover:scale-105 transition-all duration-150 ease-in-out"
                    >
                      Back to Dashboard
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AssessmentPage; 