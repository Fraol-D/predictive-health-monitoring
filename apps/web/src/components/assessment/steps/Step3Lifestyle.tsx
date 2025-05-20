'use client';

import React, { useState } from 'react';
import { LifestyleData } from '@shared/types/assessment';

interface Step3LifestyleProps {
  onNext: (data: LifestyleData) => void;
  onPrev: () => void;
  initialData?: Partial<LifestyleData>;
}

const Step3Lifestyle: React.FC<Step3LifestyleProps> = ({ onNext, onPrev, initialData }) => {
  const [physicalActivityFrequency, setPhysicalActivityFrequency] = useState(initialData?.physicalActivityFrequency || '');
  const [physicalActivityDurationMinutes, setPhysicalActivityDurationMinutes] = useState(initialData?.physicalActivityDurationMinutes?.toString() || '');
  const [sleepHoursPerNight, setSleepHoursPerNight] = useState(initialData?.sleepHoursPerNight?.toString() || '');
  const [stressLevel, setStressLevel] = useState(initialData?.stressLevel || '');
  const [smokingStatus, setSmokingStatus] = useState(initialData?.smokingStatus || '');
  const [alcoholConsumption, setAlcoholConsumption] = useState(initialData?.alcoholConsumption || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Basic error states (can be expanded)
  const [activityFreqError, setActivityFreqError] = useState('');
  const [sleepError, setSleepError] = useState('');
  const [stressError, setStressError] = useState('');
  const [smokingError, setSmokingError] = useState('');
  const [alcoholError, setAlcoholError] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    setActivityFreqError('');
    setSleepError('');
    setStressError('');
    setSmokingError('');
    setAlcoholError('');

    if (!physicalActivityFrequency) { setActivityFreqError('Activity frequency is required.'); isValid = false; }
    if (!sleepHoursPerNight) { setSleepError('Sleep hours are required.'); isValid = false; }
    else if (Number(sleepHoursPerNight) <=0 || Number(sleepHoursPerNight) > 20) {setSleepError('Enter valid sleep hours.'); isValid = false;}
    if (!stressLevel) { setStressError('Stress level is required.'); isValid = false; }
    if (!smokingStatus) { setSmokingError('Smoking status is required.'); isValid = false; }
    if (!alcoholConsumption) { setAlcoholError('Alcohol consumption is required.'); isValid = false; }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext({
        physicalActivityFrequency: physicalActivityFrequency as LifestyleData['physicalActivityFrequency'],
        physicalActivityDurationMinutes: physicalActivityDurationMinutes || undefined,
        sleepHoursPerNight: sleepHoursPerNight || undefined,
        stressLevel: stressLevel as LifestyleData['stressLevel'],
        smokingStatus: smokingStatus as LifestyleData['smokingStatus'],
        alcoholConsumption: alcoholConsumption as LifestyleData['alcoholConsumption'],
        notes,
      });
    }
  };

  const commonSelectClasses = "w-full px-4 py-2.5 bg-slate-700/60 dark:bg-gray-700/60 border border-slate-600 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-purple-500 dark:focus:border-purple-400 transition-colors appearance-none placeholder-slate-400 dark:placeholder-gray-400 text-white dark:text-gray-100";
  const commonInputClasses = commonSelectClasses.replace("appearance-none", "");
  const errorTextClasses = "mt-1 text-xs text-red-400 dark:text-red-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1 text-slate-100 dark:text-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-center text-purple-300 dark:text-purple-400">
        Step 3: Lifestyle Factors
      </h2>
      <p className="text-slate-300 dark:text-gray-300 mb-6 text-center">
        Information about your activity, sleep, and habits helps us build a more complete picture.
      </p>

      {/* Physical Activity Frequency */}
      <div>
        <label htmlFor="physicalActivityFrequency" className="block text-sm font-medium mb-1.5">Physical Activity Frequency</label>
        <select id="physicalActivityFrequency" value={physicalActivityFrequency} onChange={(e) => {setPhysicalActivityFrequency(e.target.value); if(activityFreqError) validate();}} className={`${commonSelectClasses} ${activityFreqError ? 'border-red-500' : ''}`}>
          <option value="" disabled>Select frequency...</option>
          <option value="daily">Daily</option>
          <option value="multiple_times_week">Multiple times a week</option>
          <option value="once_week">Once a week</option>
          <option value="rarely">Rarely</option>
          <option value="never">Never</option>
        </select>
        {activityFreqError && <p className={errorTextClasses}>{activityFreqError}</p>}
      </div>

      {/* Physical Activity Duration */}
      <div>
        <label htmlFor="physicalActivityDurationMinutes" className="block text-sm font-medium mb-1.5">Avg. Duration per Session (minutes, optional)</label>
        <input type="text" id="physicalActivityDurationMinutes" value={physicalActivityDurationMinutes} onChange={(e) => setPhysicalActivityDurationMinutes(e.target.value)} className={commonInputClasses} placeholder="e.g., 30 or 30-60" />
      </div>

      {/* Sleep Hours */}
      <div>
        <label htmlFor="sleepHoursPerNight" className="block text-sm font-medium mb-1.5">Avg. Sleep per Night (hours)</label>
        <input type="number" id="sleepHoursPerNight" value={sleepHoursPerNight} onChange={(e) => {setSleepHoursPerNight(e.target.value); if(sleepError) validate();}} className={`${commonInputClasses} ${sleepError ? 'border-red-500' : ''}`} placeholder="e.g., 7.5" />
        {sleepError && <p className={errorTextClasses}>{sleepError}</p>}
      </div>

      {/* Stress Level */}
      <div>
        <label htmlFor="stressLevel" className="block text-sm font-medium mb-1.5">General Stress Level</label>
        <select id="stressLevel" value={stressLevel} onChange={(e) => {setStressLevel(e.target.value); if(stressError) validate();}} className={`${commonSelectClasses} ${stressError ? 'border-red-500' : ''}`}>
          <option value="" disabled>Select level...</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
          <option value="very_high">Very High</option>
        </select>
        {stressError && <p className={errorTextClasses}>{stressError}</p>}
      </div>
      
      {/* Smoking Status */}
      <div>
        <label htmlFor="smokingStatus" className="block text-sm font-medium mb-1.5">Smoking Status</label>
        <select id="smokingStatus" value={smokingStatus} onChange={(e) => {setSmokingStatus(e.target.value); if(smokingError) validate();}} className={`${commonSelectClasses} ${smokingError ? 'border-red-500' : ''}`}>
          <option value="" disabled>Select status...</option>
          <option value="never">Never Smoked</option>
          <option value="former">Former Smoker</option>
          <option value="current_light">Current Light Smoker (e.g. &lt;10/day)</option>
          <option value="current_heavy">Current Heavy Smoker (e.g. &gt;10/day)</option>
        </select>
        {smokingError && <p className={errorTextClasses}>{smokingError}</p>}
      </div>

      {/* Alcohol Consumption */}
      <div>
        <label htmlFor="alcoholConsumption" className="block text-sm font-medium mb-1.5">Alcohol Consumption</label>
        <select id="alcoholConsumption" value={alcoholConsumption} onChange={(e) => {setAlcoholConsumption(e.target.value); if(alcoholError) validate();}} className={`${commonSelectClasses} ${alcoholError ? 'border-red-500' : ''}`}>
          <option value="" disabled>Select level...</option>
          <option value="none">None / Rarely</option>
          <option value="occasional">Occasional (e.g. 1-2 drinks/week)</option>
          <option value="moderate">Moderate (e.g. up to 1/day women, 2/day men)</option>
          <option value="heavy">Heavy (more than moderate)</option>
        </select>
        {alcoholError && <p className={errorTextClasses}>{alcoholError}</p>}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1.5">Additional Lifestyle Notes (optional)</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${commonInputClasses} min-h-[80px]`} placeholder="e.g., I meditate daily, I work night shifts..."></textarea>
      </div>

      <div className="mt-8 flex w-full justify-between items-center">
        <button type="button" onClick={onPrev} className="px-7 py-3 rounded-lg bg-slate-600 dark:bg-gray-600 hover:bg-slate-500 dark:hover:bg-gray-500 text-white font-semibold shadow-lg transition-colors duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-gray-400">
          Previous
        </button>
        <button type="submit" className="px-7 py-3.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-xl transform hover:scale-105 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75">
          Next: Symptoms (Placeholder)
        </button>
      </div>
    </form>
  );
};

export default Step3Lifestyle; 