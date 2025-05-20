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

export interface SymptomsData {
  // ... for symptoms
} 