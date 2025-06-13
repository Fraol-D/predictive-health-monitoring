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
        <label className="block text-sm font-medium mb-2 text-muted-foreground">
          Frequency of Fruit and Vegetable Consumption
        </label>
        <select
          value={data.fruitVegFrequency}
          onChange={(e) => handleChange('fruitVegFrequency', e.target.value)}
          className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
        >
          <option value="daily">Daily</option>
          <option value="multiple_times_week">Multiple times a week</option>
          <option value="once_week">Once a week</option>
          <option value="rarely">Rarely</option>
          <option value="never">Never</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-muted-foreground">
          Frequency of Processed Food Consumption
        </label>
        <select
          value={data.processedFoodFrequency}
          onChange={(e) => handleChange('processedFoodFrequency', e.target.value)}
          className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
        >
          <option value="daily">Daily</option>
          <option value="multiple_times_week">Multiple times a week</option>
          <option value="once_week">Once a week</option>
          <option value="rarely">Rarely</option>
          <option value="never">Never</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-muted-foreground">
          Daily Water Intake (Liters)
        </label>
        <input
          type="number"
          min="0"
          step="0.1"
          className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
          value={data.waterIntakeLiters}
          onChange={(e) => handleChange('waterIntakeLiters', parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-muted-foreground">
          Dietary Restrictions (select all that apply)
        </label>
        <div className="space-y-2">
          {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto'].map((restriction) => (
            <label key={restriction} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={data.dietaryRestrictions?.includes(restriction)}
                onChange={(e) => handleDietaryRestrictionsChange(restriction, e.target.checked)}
                className="rounded h-5 w-5 border-border text-primary focus:ring-primary/50"
              />
              <span className="text-sm text-foreground capitalize">{restriction}</span>
            </label>
          ))}
        </div>
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
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold transition-colors"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold shadow-md transform hover:scale-105 transition-all duration-150 ease-in-out ml-auto"
        >
          Next
        </button>
      </div>
    </div>
  );
};
