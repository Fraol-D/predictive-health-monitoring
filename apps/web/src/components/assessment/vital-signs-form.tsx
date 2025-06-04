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
          <label className="block text-sm font-medium mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            min="0"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={data.height || ''}
            onChange={(e) => handleChange('height', e.target.value ? parseInt(e.target.value) : 0)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={data.weight || ''}
            onChange={(e) => handleChange('weight', e.target.value ? parseFloat(e.target.value) : 0)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Blood Pressure (mmHg)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Systolic
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              value={data.bloodPressure?.systolic || ''}
              onChange={(e) => handleBloodPressureChange('systolic', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Diastolic
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              value={data.bloodPressure?.diastolic || ''}
              onChange={(e) => handleBloodPressureChange('diastolic', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Blood Sugar (mg/dL) (Optional)
          </label>
          <input
            type="number"
            min="0"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={data.bloodSugar || ''}
            onChange={(e) => handleChange('bloodSugar', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Heart Rate (bpm) (Optional)
          </label>
          <input
            type="number"
            min="0"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={data.heartRate || ''}
            onChange={(e) => handleChange('heartRate', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
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
          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold shadow-md transform hover:scale-105 transition-all duration-150 ease-in-out"
        >
          Complete Assessment
        </button>
      </div>
    </div>
  );
}; 