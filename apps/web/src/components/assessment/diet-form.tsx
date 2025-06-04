import React from 'react';
import { DietData } from '@shared/types/assessment';

interface DietFormProps {
  data: DietData;
  onChange: (data: DietData) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const DietForm: React.FC<DietFormProps> = ({ data, onChange, onNext, onBack }) => {
  const handleChange = (field: keyof DietData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleDietaryRestrictionsChange = (restriction: string, isChecked: boolean) => {
    const currentRestrictions = data.dietaryRestrictions || [];
    const updatedRestrictions = isChecked
      ? [...currentRestrictions, restriction]
      : currentRestrictions.filter((r) => r !== restriction);
    handleChange('dietaryRestrictions', updatedRestrictions);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Frequency of Fruit and Vegetable Consumption
        </label>
        <select
          value={data.fruitVegFrequency}
          onChange={(e) => handleChange('fruitVegFrequency', e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <option value="daily">Daily</option>
          <option value="multiple_times_week">Multiple times a week</option>
          <option value="once_week">Once a week</option>
          <option value="rarely">Rarely</option>
          <option value="never">Never</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Frequency of Processed Food Consumption
        </label>
        <select
          value={data.processedFoodFrequency}
          onChange={(e) => handleChange('processedFoodFrequency', e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <option value="daily">Daily</option>
          <option value="multiple_times_week">Multiple times a week</option>
          <option value="once_week">Once a week</option>
          <option value="rarely">Rarely</option>
          <option value="never">Never</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Daily Water Intake (Liters)
        </label>
        <input
          type="number"
          min="0"
          step="0.1"
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          value={data.waterIntakeLiters}
          onChange={(e) => handleChange('waterIntakeLiters', parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Dietary Restrictions (select all that apply)
        </label>
        <div className="space-y-2">
          {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto'].map((restriction) => (
            <label key={restriction} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.dietaryRestrictions?.includes(restriction)}
                onChange={(e) => handleDietaryRestrictionsChange(restriction, e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-700"
              />
              <span className="text-sm capitalize">{restriction}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          rows={3}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          value={data.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-md transform hover:scale-105 transition-all duration-150 ease-in-out"
        >
          Next
        </button>
      </div>
    </div>
  );
}; 