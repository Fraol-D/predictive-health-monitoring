import React from 'react';
import { VitalSignsData } from '@shared/types/assessment';

interface VitalSignsFormProps {
  data: VitalSignsData;
  onChange: (data: VitalSignsData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const VitalSignsForm: React.FC<VitalSignsFormProps> = ({ data, onChange, onNext, onBack }) => {
  const handleChange = (field: keyof VitalSignsData, value: number | undefined) => {
    onChange({ ...data, [field]: value });
  };

  const handleBloodPressureChange = (type: 'systolic' | 'diastolic', valueStr: string) => {
    const numValue = parseInt(valueStr);
    onChange({
      ...data,
      bloodPressure: {
        systolic: type === 'systolic' ? (valueStr === '' ? 0 : numValue) : (data.bloodPressure?.systolic ?? 0),
        diastolic: type === 'diastolic' ? (valueStr === '' ? 0 : numValue) : (data.bloodPressure?.diastolic ?? 0),
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Height (cm)
          </label>
          <input
            type="number"
            min="0"
            className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
            value={data.height || ''}
            onChange={(e) => handleChange('height', e.target.value ? parseInt(e.target.value) : 0)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Weight (kg)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
            value={data.weight || ''}
            onChange={(e) => handleChange('weight', e.target.value ? parseFloat(e.target.value) : 0)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-foreground">Blood Pressure (mmHg)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Systolic
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
              value={data.bloodPressure?.systolic || ''}
              onChange={(e) => handleBloodPressureChange('systolic', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Diastolic
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
              value={data.bloodPressure?.diastolic || ''}
              onChange={(e) => handleBloodPressureChange('diastolic', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Blood Sugar (mg/dL) (Optional)
          </label>
          <input
            type="number"
            min="0"
            className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
            value={data.bloodSugar || ''}
            onChange={(e) => handleChange('bloodSugar', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Heart Rate (bpm) (Optional)
          </label>
          <input
            type="number"
            min="0"
            className="w-full p-3 rounded-lg border bg-background text-foreground border-border focus:ring-2 focus:ring-primary/50 focus:border-primary"
            value={data.heartRate || ''}
            onChange={(e) => handleChange('heartRate', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
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
          Complete Assessment
        </button>
      </div>
    </div>
  );
};
