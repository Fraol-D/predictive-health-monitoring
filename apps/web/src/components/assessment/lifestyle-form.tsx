import React from 'react';
import { LifestyleData } from '@shared/types/assessment';

interface LifestyleFormProps {
  data: LifestyleData;
  onChange: (data: LifestyleData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const LifestyleForm: React.FC<LifestyleFormProps> = ({ data, onChange, onNext, onBack }) => {
  const handleChange = (field: keyof LifestyleData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Frequency of Physical Activity
        </label>
        <select
          value={data.physicalActivityFrequency}
          onChange={(e) => handleChange('physicalActivityFrequency', e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <option value="daily">Daily</option>
          <option value="multiple_times_week">Multiple times a week</option>
          <option value="once_week">Once a week</option>
          <option value="rarely">Rarely</option>
          <option value="never">Never</option>
        </select>
      </div>

      {(data.physicalActivityFrequency !== 'never' && data.physicalActivityFrequency !== 'rarely') && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Average Duration of Physical Activity (minutes per session)
          </label>
          <input
            type="number"
            min="0"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={data.physicalActivityDurationMinutes || ''}
            onChange={(e) => handleChange('physicalActivityDurationMinutes', parseInt(e.target.value))}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          Average Hours of Sleep Per Night
        </label>
        <input
          type="number"
          min="0"
          step="0.5"
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          value={data.sleepHoursPerNight || ''}
          onChange={(e) => handleChange('sleepHoursPerNight', parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Current Stress Level
        </label>
        <select
          value={data.stressLevel}
          onChange={(e) => handleChange('stressLevel', e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
          <option value="very_high">Very High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Smoking Status
        </label>
        <select
          value={data.smokingStatus}
          onChange={(e) => handleChange('smokingStatus', e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <option value="never">Never Smoked</option>
          <option value="former">Former Smoker</option>
          <option value="current_light">Current Light Smoker</option>
          <option value="current_heavy">Current Heavy Smoker</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Alcohol Consumption
        </label>
        <select
          value={data.alcoholConsumption}
          onChange={(e) => handleChange('alcoholConsumption', e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <option value="none">None</option>
          <option value="occasional">Occasional</option>
          <option value="moderate">Moderate</option>
          <option value="heavy">Heavy</option>
        </select>
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

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-semibold shadow-md transform hover:scale-105 transition-all duration-150 ease-in-out"
        >
          Back
        </button>
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