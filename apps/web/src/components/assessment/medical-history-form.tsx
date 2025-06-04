import React from 'react';
import { MedicalHistoryData } from '@shared/types/assessment';

interface MedicalHistoryFormProps {
  data: MedicalHistoryData;
  onChange: (data: MedicalHistoryData) => void;
  onNext: () => void;
  onBack: () => void;
}

export const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({ data, onChange, onNext, onBack }) => {
  const handleChange = (field: keyof MedicalHistoryData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleFamilyHistoryChange = (condition: keyof MedicalHistoryData['familyHistory'], value: boolean) => {
    onChange({
      ...data,
      familyHistory: {
        ...data.familyHistory,
        [condition]: value,
      },
    });
  };

  const handleExistingConditionsChange = (condition: string, isChecked: boolean) => {
    const current = data.existingConditions || [];
    const updated = isChecked
      ? [...current, condition]
      : current.filter((c) => c !== condition);
    handleChange('existingConditions', updated);
  };

  const handleMedicationsChange = (medication: string, isChecked: boolean) => {
    const current = data.medications || [];
    const updated = isChecked
      ? [...current, medication]
      : current.filter((m) => m !== medication);
    handleChange('medications', updated);
  };

  const handleAllergiesChange = (allergy: string, isChecked: boolean) => {
    const current = data.allergies || [];
    const updated = isChecked
      ? [...current, allergy]
      : current.filter((a) => a !== allergy);
    handleChange('allergies', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Family History</h3>
        <div className="space-y-2">
          {Object.entries(data.familyHistory).map(([condition, value]) => {
            if (condition === 'other') return null;
            return (
              <label key={condition} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(e) => handleFamilyHistoryChange(condition as keyof MedicalHistoryData['familyHistory'], e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-700"
                />
                <span className="text-sm capitalize">{condition.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Existing Conditions</h3>
        <div className="space-y-2">
          {[
            'hypertension',
            'diabetes',
            'heart disease',
            'asthma',
            'arthritis',
            'thyroid disorder',
            'depression',
            'anxiety',
          ].map((condition) => (
            <label key={condition} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.existingConditions?.includes(condition)}
                onChange={(e) => handleExistingConditionsChange(condition, e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-700"
              />
              <span className="text-sm capitalize">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Current Medications</h3>
        <div className="space-y-2">
          {[
            'blood pressure medication',
            'diabetes medication',
            'cholesterol medication',
            'thyroid medication',
            'antidepressants',
            'pain medication',
          ].map((medication) => (
            <label key={medication} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.medications?.includes(medication)}
                onChange={(e) => handleMedicationsChange(medication, e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-700"
              />
              <span className="text-sm capitalize">{medication}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Allergies</h3>
        <div className="space-y-2">
          {[
            'penicillin',
            'sulfa drugs',
            'aspirin',
            'latex',
            'pollen',
            'dust',
            'pet dander',
            'food allergies',
          ].map((allergy) => (
            <label key={allergy} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.allergies?.includes(allergy)}
                onChange={(e) => handleAllergiesChange(allergy, e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-700"
              />
              <span className="text-sm capitalize">{allergy}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Date of Last Checkup
        </label>
        <input
          type="date"
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          value={data.lastCheckup}
          onChange={(e) => handleChange('lastCheckup', e.target.value)}
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