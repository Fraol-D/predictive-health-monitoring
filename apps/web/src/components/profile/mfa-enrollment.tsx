'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { auth } from '@/lib/firebase';
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  multiFactor,
  PhoneMultiFactorGenerator,
} from 'firebase/auth';
import { Phone, ShieldCheck, CheckCircle } from 'lucide-react';

export const MfaEnrollment = () => {
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [uiState, setUiState] = useState<'idle' | 'verifying' | 'enrolled'>('idle');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const hasPhoneFactor = multiFactor(user).enrolledFactors.some(
        (factor) => factor.factorId === PhoneMultiFactorGenerator.FACTOR_ID
      );
      setIsEnrolled(hasPhoneFactor);
      if (hasPhoneFactor) {
        setUiState('enrolled');
      }
    }
  }, [user]);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-enroll', {
        size: 'invisible',
      });
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const newVerificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier
      );
      setVerificationId(newVerificationId);
      setUiState('verifying');
    } catch (err) {
      console.error('MFA Enrollment Error:', err);
      setError('Failed to send verification code. Check the phone number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      await multiFactor(user!).enroll(multiFactorAssertion, `My Phone`);
      setIsEnrolled(true);
      setUiState('enrolled');
    } catch (err) {
      console.error('MFA Verification Error:', err);
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const phoneFactor = multiFactor(user).enrolledFactors.find(
        f => f.factorId === PhoneMultiFactorGenerator.FACTOR_ID
      );
      if (phoneFactor) {
        await multiFactor(user).unenroll(phoneFactor);
        setIsEnrolled(false);
        setUiState('idle');
        setPhoneNumber('');
      }
    } catch (err) {
        console.error('MFA Unenrollment Error:', err);
        setError('Failed to disable two-factor authentication. Please try again later.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <section className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg mt-8">
        <div id="recaptcha-container-enroll"></div>
        <h2 className='text-2xl font-semibold mb-4 flex items-center border-b border-border/20 pb-4'>
            <ShieldCheck className='w-6 h-6 text-primary mr-3' /> Security Settings
        </h2>

        {uiState === 'enrolled' ? (
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-900/40 rounded-lg border border-green-500/50">
                    <div className="flex items-center">
                        <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                        <div>
                            <h3 className='text-lg font-medium'>Two-Factor Authentication is Active</h3>
                            <p className='text-sm text-muted-foreground'>Your account is secured with phone verification.</p>
                        </div>
                    </div>
                     <button 
                        onClick={handleUnenroll}
                        disabled={loading}
                        className="px-4 py-1.5 text-sm border border-red-500/50 text-red-400 rounded-md hover:bg-red-900/50 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Disabling...' : 'Disable'}
                    </button>
                </div>
            </div>
        ) : uiState === 'idle' ? (
            <form onSubmit={handleEnroll} className="space-y-4">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-2">
                        Enable Two-Factor Authentication
                    </label>
                    <p className='text-xs text-muted-foreground mb-3'>
                        Add an extra layer of security to your account. We will send a verification code to your phone when you log in.
                    </p>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-muted-foreground"
                            placeholder="+1 650 555 1234"
                        />
                    </div>
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-2.5 rounded-lg bg-primary/80 hover:bg-primary text-primary-foreground font-semibold shadow-md transform hover:scale-105 transition-all"
                >
                    {loading ? 'Sending Code...' : 'Enable 2FA'}
                </button>
            </form>
        ) : ( // uiState === 'verifying'
             <form onSubmit={handleVerify} className="space-y-4">
                 <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-muted-foreground mb-2">
                        Enter Verification Code
                    </label>
                     <p className='text-xs text-muted-foreground mb-3'>
                        A code was sent to {phoneNumber}. Enter it below to complete setup.
                    </p>
                    <div className="relative">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            name="verificationCode"
                            id="verificationCode"
                            required
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-muted-foreground"
                            placeholder="123456"
                        />
                    </div>
                </div>
                 {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-2.5 rounded-lg bg-primary/80 hover:bg-primary text-primary-foreground font-semibold shadow-md transform hover:scale-105 transition-all"
                >
                    {loading ? 'Verifying...' : 'Verify & Enable'}
                </button>
            </form>
        )}
    </section>
  );
}; 