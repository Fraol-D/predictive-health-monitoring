'use client';

import React, { useState } from 'react';

interface Step1Data {
  age: string; // Or number, depending on how you want to handle it
  sex: string;
  weight: string; // Or number
  weightUnit: 'kg' | 'lbs';
}

interface Step1DemographicsProps {
  onNext: (data: Step1Data) => void;
  initialData?: Partial<Step1Data>;
}

const Step1Demographics: React.FC<Step1DemographicsProps> = ({ onNext, initialData }) => {
  const [age, setAge] = useState(initialData?.age || '');
  const [sex, setSex] = useState(initialData?.sex || '');
  const [weight, setWeight] = useState(initialData?.weight || '');
  const [weightUnit, setWeightUnit] = useState(initialData?.weightUnit || 'kg');
  
  // State for error messages
  const [ageError, setAgeError] = useState('');
  const [sexError, setSexError] = useState('');
  const [weightError, setWeightError] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    setAgeError('');
    setSexError('');
    setWeightError('');

    if (!age) {
      setAgeError('Age is required.');
      isValid = false;
    } else if (isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      setAgeError('Please enter a valid age (1-120).');
      isValid = false;
    }

    if (!sex) {
      setSexError('Sex is required.');
      isValid = false;
    }

    if (!weight) {
      setWeightError('Weight is required.');
      isValid = false;
    } else if (isNaN(Number(weight)) || Number(weight) <= 0) {
      setWeightError('Please enter a valid weight.');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext({ age, sex, weight, weightUnit });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1"> {/* Adjusted space-y for tighter error messages*/}
      <h2 className="text-2xl font-semibold mb-6 text-center text-purple-300">
        Step 1: Basic Information
      </h2>
      <p className="text-slate-300 mb-6 text-center">
        Let's start with some basic details to build your health profile.
      </p>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-slate-300 mb-1.5">
          Age (Years)
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={age}
          onChange={(e) => { setAge(e.target.value); if (ageError) validate(); }}
          aria-describedby="age-error"
          className={`w-full px-4 py-2.5 bg-slate-700/60 border rounded-lg focus:ring-2 focus:border-purple-500 placeholder-slate-400 transition-colors ${ageError ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-purple-500'}`}
          placeholder="Enter your age"
        />
        {ageError && <p id="age-error" className="mt-1 text-xs text-red-400">{ageError}</p>}
      </div>

      <div>
        <label htmlFor="sex" className="block text-sm font-medium text-slate-300 mb-1.5">
          Sex Assigned at Birth
        </label>
        <select
          id="sex"
          name="sex"
          value={sex}
          onChange={(e) => { setSex(e.target.value); if (sexError) validate(); }}
          aria-describedby="sex-error"
          className={`w-full px-4 py-2.5 bg-slate-700/60 border rounded-lg focus:ring-2 focus:border-purple-500 transition-colors appearance-none ${sexError ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-purple-500'}`}
        >
          <option value="" disabled>Select your sex...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          {/* Consider adding 'Other' or 'Prefer not to say' based on requirements */}
        </select>
        {sexError && <p id="sex-error" className="mt-1 text-xs text-red-400">{sexError}</p>}
      </div>

      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-slate-300 mb-1.5">
          Current Weight
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            id="weight"
            name="weight"
            value={weight}
            onChange={(e) => { setWeight(e.target.value); if (weightError) validate(); }}
            step="0.1"
            aria-describedby="weight-error"
            className={`w-2/3 px-4 py-2.5 bg-slate-700/60 border rounded-lg focus:ring-2 focus:border-purple-500 placeholder-slate-400 transition-colors ${weightError ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-purple-500'}`}
            placeholder="Enter your weight"
          />
          <select
            id="weightUnit"
            name="weightUnit"
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
            className="w-1/3 px-4 py-2.5 bg-slate-700/60 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors appearance-none"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
        {weightError && <p id="weight-error" className="mt-1 text-xs text-red-400">{weightError}</p>}
      </div>

      <button
        type="submit"
        className="mt-8 w-full px-6 py-3.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-xl transform hover:scale-105 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75"
      >
        Next: Lifestyle
      </button>
    </form>
  );
};

export default Step1Demographics; 