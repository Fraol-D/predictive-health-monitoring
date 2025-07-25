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
    <div className="h-[60vh] max-h-[700px] overflow-y-auto pr-4 sidebar-scroll-container">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Frequency of Physical Activity
          </label>
          <select
            value={data.physicalActivityFrequency}
            onChange={(e) => handleChange('physicalActivityFrequency', e.target.value)}
            className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
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
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Average Duration of Physical Activity (minutes per session)
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
              value={data.physicalActivityDurationMinutes || ''}
              onChange={(e) => handleChange('physicalActivityDurationMinutes', parseInt(e.target.value))}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Average Hours of Sleep Per Night
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
            value={data.sleepHoursPerNight || ''}
            onChange={(e) => handleChange('sleepHoursPerNight', parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Current Stress Level
          </label>
          <select
            value={data.stressLevel}
            onChange={(e) => handleChange('stressLevel', e.target.value)}
            className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
            <option value="very_high">Very High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Smoking Status
          </label>
          <select
            value={data.smokingStatus}
            onChange={(e) => handleChange('smokingStatus', e.target.value)}
            className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="never">Never Smoked</option>
            <option value="former">Former Smoker</option>
            <option value="current_light">Current Light Smoker</option>
            <option value="current_heavy">Current Heavy Smoker</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Alcohol Consumption
          </label>
          <select
            value={data.alcoholConsumption}
            onChange={(e) => handleChange('alcoholConsumption', e.target.value)}
            className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="none">None</option>
            <option value="occasional">Occasional</option>
            <option value="moderate">Moderate</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Additional Notes (Optional)
          </label>
          <textarea
            rows={3}
            className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
            value={data.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold shadow-md transform hover:scale-105 transition-all duration-150 ease-in-out"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}; 