'use client';

import React, { useState } from 'react';
import { DietData } from '@shared/types/assessment';

interface Step2DietProps {
  onNext: (data: DietData) => void;
  onPrev: () => void;
  initialData?: Partial<DietData>;
}

const Step2Diet: React.FC<Step2DietProps> = ({ onNext, onPrev, initialData }) => {
  const [fruitVegFrequency, setFruitVegFrequency] = useState(initialData?.fruitVegFrequency || '');
  const [processedFoodFrequency, setProcessedFoodFrequency] = useState(initialData?.processedFoodFrequency || '');
  const [waterIntakeLiters, setWaterIntakeLiters] = useState(initialData?.waterIntakeLiters?.toString() || '2');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(initialData?.dietaryRestrictions || []);
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Error states
  const [fruitVegError, setFruitVegError] = useState('');
  const [processedFoodError, setProcessedFoodError] = useState('');
  const [waterIntakeError, setWaterIntakeError] = useState('');

  const restrictionOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low Carb'];

  const handleRestrictionChange = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction) 
        ? prev.filter(r => r !== restriction) 
        : [...prev, restriction]
    );
  };

  const validateStep2 = (): boolean => {
    let isValid = true;
    setFruitVegError('');
    setProcessedFoodError('');
    setWaterIntakeError('');

    if (!fruitVegFrequency) {
      setFruitVegError('Please select a frequency.');
      isValid = false;
    }
    if (!processedFoodFrequency) {
      setProcessedFoodError('Please select a frequency.');
      isValid = false;
    }
    if (!waterIntakeLiters) {
      setWaterIntakeError('Water intake is required.');
      isValid = false;
    } else {
      const waterNum = parseFloat(waterIntakeLiters as string);
      if (isNaN(waterNum) || waterNum < 0) {
        setWaterIntakeError('Please enter a valid positive number for water intake.');
        isValid = false;
      }
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      const waterIntake = parseFloat(waterIntakeLiters as string);
      onNext({
        fruitVegFrequency: fruitVegFrequency as DietData['fruitVegFrequency'],
        processedFoodFrequency: processedFoodFrequency as DietData['processedFoodFrequency'],
        waterIntakeLiters: isNaN(waterIntake) ? waterIntakeLiters : waterIntake, // Send original string if not a number, or parsed number
        dietaryRestrictions,
        notes,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1"> {/* Adjusted space-y */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-purple-300">
        Step 2: Dietary Habits
      </h2>
      <p className="text-slate-300 mb-6 text-center">
        Please tell us about your typical diet.
      </p>

      <div>
        <label htmlFor="fruitVegFrequency" className="block text-sm font-medium text-slate-300 mb-1.5">
          How often do you eat fruits and vegetables?
        </label>
        <select
          id="fruitVegFrequency"
          name="fruitVegFrequency"
          value={fruitVegFrequency}
          onChange={(e) => { setFruitVegFrequency(e.target.value); if(fruitVegError) validateStep2(); }}
          aria-describedby="fruitveg-error"
          className={`w-full px-4 py-2.5 bg-slate-700/60 border rounded-lg focus:ring-2 focus:border-purple-500 transition-colors appearance-none ${fruitVegError ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-purple-500'}`}
        >
          <option value="" disabled>Select frequency...</option>
          <option value="daily">Daily</option>
          <option value="multiple_times_week">Multiple times a week</option>
          <option value="once_week">Once a week</option>
          <option value="rarely">Rarely</option>
          <option value="never">Never</option>
        </select>
        {fruitVegError && <p id="fruitveg-error" className="mt-1 text-xs text-red-400">{fruitVegError}</p>}
      </div>

      <div>
        <label htmlFor="processedFoodFrequency" className="block text-sm font-medium text-slate-300 mb-1.5">
          How often do you consume processed foods? (e.g., fast food, packaged snacks)
        </label>
        <select
          id="processedFoodFrequency"
          name="processedFoodFrequency"
          value={processedFoodFrequency}
          onChange={(e) => { setProcessedFoodFrequency(e.target.value); if(processedFoodError) validateStep2(); }}
          aria-describedby="processedfood-error"
          className={`w-full px-4 py-2.5 bg-slate-700/60 border rounded-lg focus:ring-2 focus:border-purple-500 transition-colors appearance-none ${processedFoodError ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-purple-500'}`}
        >
          <option value="" disabled>Select frequency...</option>
          <option value="daily">Daily</option>
          <option value="multiple_times_week">Multiple times a week</option>
          <option value="once_week">Once a week</option>
          <option value="rarely">Rarely</option>
          <option value="never">Never</option>
        </select>
        {processedFoodError && <p id="processedfood-error" className="mt-1 text-xs text-red-400">{processedFoodError}</p>}
      </div>

      <div>
        <label htmlFor="waterIntakeLiters" className="block text-sm font-medium text-slate-300 mb-1.5">
          Average daily water intake (liters)?
        </label>
        <input
          type="number"
          id="waterIntakeLiters"
          name="waterIntakeLiters"
          value={waterIntakeLiters}
          onChange={(e) => { setWaterIntakeLiters(e.target.value); if(waterIntakeError) validateStep2(); }}
          step="0.1"
          min="0"
          aria-describedby="waterintake-error"
          className={`w-full px-4 py-2.5 bg-slate-700/60 border rounded-lg focus:ring-2 focus:border-purple-500 placeholder-slate-400 transition-colors ${waterIntakeError ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-purple-500'}`}
          placeholder="e.g., 2.5"
        />
        {waterIntakeError && <p id="waterintake-error" className="mt-1 text-xs text-red-400">{waterIntakeError}</p>}
      </div>

      {/* Dietary Restrictions (no specific validation for now, as it's optional) */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Do you follow any specific dietary restrictions or preferences? (Select all that apply)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {restrictionOptions.map((restriction) => (
            <label key={restriction} htmlFor={restriction} className="flex items-center space-x-2 p-2.5 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-purple-500 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                id={restriction}
                name="dietaryRestrictions"
                value={restriction}
                checked={dietaryRestrictions.includes(restriction)}
                onChange={() => handleRestrictionChange(restriction)}
                className="form-checkbox h-5 w-5 text-purple-500 bg-slate-600 border-slate-500 rounded focus:ring-purple-500 focus:ring-offset-slate-800"
              />
              <span className="text-slate-200 text-sm">{restriction}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1.5">
          Any other notes about your diet? (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-700/60 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400 transition-colors"
          placeholder="e.g., I try to avoid red meat, I am allergic to shellfish..."
        />
      </div>

      <div className="mt-8 flex justify-between items-center"> {/* Adjusted mt for consistency */}
        <button
          type="button"
          onClick={onPrev}
          className="px-7 py-3 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-semibold shadow-lg transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-7 py-3.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-xl transform hover:scale-105 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75"
        >
          Next: Physical Activity
        </button>
      </div>
    </form>
  );
};

export default Step2Diet; 