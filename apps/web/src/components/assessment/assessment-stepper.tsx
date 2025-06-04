import React from 'react';
import { motion } from 'framer-motion';
import { AssessmentStep } from '@shared/types/assessment';

interface AssessmentStepperProps {
  steps: AssessmentStep[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}

export const AssessmentStepper: React.FC<AssessmentStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <motion.div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => onStepClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                  ${
                    index < currentStep
                      ? 'bg-green-500'
                      : index === currentStep
                      ? 'bg-primary'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }
                  transition-colors duration-200`}
              >
                {index < currentStep ? (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      index === currentStep
                        ? 'text-white'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  index === currentStep
                    ? 'text-primary'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {step.title}
              </span>
            </motion.div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}; 