export interface DietData {
  fruitVegFrequency: 'daily' | 'multiple_times_week' | 'once_week' | 'rarely' | 'never';
  processedFoodFrequency: 'daily' | 'multiple_times_week' | 'once_week' | 'rarely' | 'never';
  waterIntakeLiters: number | string; // string to allow for ranges or descriptive input initially
  dietaryRestrictions?: string[]; // e.g., ['vegetarian', 'gluten-free']
  notes?: string; // General notes about diet
}

// We can expand this later for other assessment steps
export interface LifestyleData {
  physicalActivityFrequency: 'daily' | 'multiple_times_week' | 'once_week' | 'rarely' | 'never';
  physicalActivityDurationMinutes?: number | string; // e.g., 30, 60, or "30-60"
  sleepHoursPerNight?: number | string; // e.g., 7, or "6-8"
  stressLevel: 'low' | 'moderate' | 'high' | 'very_high';
  smokingStatus: 'never' | 'former' | 'current_light' | 'current_heavy';
  alcoholConsumption: 'none' | 'occasional' | 'moderate' | 'heavy';
  notes?: string;
}

export interface MedicalHistoryData {
  familyHistory: {
    diabetes: boolean;
    heartDisease: boolean;
    hypertension: boolean;
    cancer: boolean;
    other?: string[];
  };
  existingConditions: string[];
  medications: string[];
  allergies: string[];
  lastCheckup: string; // ISO date string
}

export interface VitalSignsData {
  height: number; // in cm
  weight: number; // in kg
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  bloodSugar?: number | undefined; // in mg/dL - Mark as explicitly allowing undefined
  heartRate?: number | undefined; // in bpm - Mark as explicitly allowing undefined
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AssessmentData {
  id: string;
  userId: string;
  timestamp: string;
  step1?: {
    age: string;
    sex: string;
    weight: string;
    weightUnit: 'kg' | 'lbs';
  };
  step2?: DietData;
  step3?: LifestyleData;
  diet: DietData;
  lifestyle: LifestyleData;
  medicalHistory: MedicalHistoryData;
  vitalSigns: VitalSignsData;
  riskScores: {
    diabetes: number;
    heartDisease: number;
    hypertension: number;
    overall: number;
  };
  recommendations: Recommendation[];
  status: 'draft' | 'completed';
}

export interface AssessmentStep {
  id: string;
  title: string;
  description: string;
  component: string;
  isCompleted: boolean;
  data?: any;
}

export interface AssessmentProgress {
  currentStep: number;
  totalSteps: number;
  steps: AssessmentStep[];
} 