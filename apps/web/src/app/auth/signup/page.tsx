'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/layout/page-layout';
import { Mail, KeyRound, Phone, ShieldCheck, User } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  PhoneAuthProvider,
  RecaptchaVerifier,
  multiFactor,
  PhoneMultiFactorGenerator
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

type UiState = 'register' | 'verifyPhone';

const SignupPage = () => {
  const [uiState, setUiState] = useState<UiState>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // This effect ensures reCAPTCHA is rendered when needed
    if (uiState === 'register') {
      // Ensure the container is cleared if the user goes back
      const container = document.getElementById('recaptcha-container-signup');
      if (container) {
        container.innerHTML = '';
      }
    }
  }, [uiState]);


  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-signup', {
            size: 'invisible',
        });
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const newVerificationId = await phoneAuthProvider.verifyPhoneNumber(
            phoneNumber,
            recaptchaVerifier
        );
        setVerificationId(newVerificationId);
        setUiState('verifyPhone');
    } catch (err: any) {
        console.error('Phone verification sending error:', err);
        setError('Failed to send verification code. Please check your phone number and try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        // Step 1: Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Step 2: Update the user's profile with display name
        await updateProfile(user, { displayName });

        // Step 3: Build the phone credential using the verification ID and code
        const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
        
        // Step 4: Create the assertion
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneCredential);

        // Step 5: Enroll the phone number as a second factor
        await multiFactor(user).enroll(multiFactorAssertion, displayName);

        // Success, redirect to home
        router.push('/');

    } catch (err: any) {
        let errorMessage = 'An unexpected error occurred. Please try again.';
        if (err.code === 'auth/email-already-in-use') {
            errorMessage = 'This email address is already in use by another account.';
        } else if (err.code === 'auth/invalid-verification-code') {
            errorMessage = 'The verification code is invalid. Please try again.';
        } else if (err.code === 'auth/weak-password') {
            errorMessage = 'The password is too weak. Please use at least 6 characters.';
        }
        console.error('Full sign-up error:', err);
        setError(errorMessage);
        // If user creation fails, we should ideally let them correct the info
        // For simplicity here, we'll reset to the initial registration form
        setUiState('register');
    } finally {
        setLoading(false);
    }
  };


  return (
    <PageLayout centeredContent>
      <div id="recaptcha-container-signup"></div>
      <div className="w-full max-w-md">
        <div className="bg-card/80 backdrop-blur-lg rounded-xl shadow-2xl p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    {uiState === 'register' ? 'Create Your Account' : 'Verify Your Phone'}
                </h1>
                <p className="text-muted-foreground">
                    {uiState === 'register' 
                        ? 'Join to start your health journey.' 
                        : `A code was sent to ${phoneNumber}.`}
                </p>
            </div>

            {uiState === 'register' ? (
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input type="text" name="displayName" id="displayName" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="Alex Doe" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input type="email" name="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="alex.doe@example.com" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input type="password" name="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="••••••••" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input type="tel" name="phone" id="phone" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="+1 650 555 1234" />
                        </div>
                    </div>
                    
                    {error && <p className="text-sm text-red-500 bg-red-900/30 p-3 rounded-lg text-center">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-lg text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:ring-blue-500">
                        {loading ? 'Sending Code...' : 'Continue'}
                    </button>
                </form>
            ) : ( // 'verifyPhone' state
                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="verificationCode" className="block text-sm font-medium text-muted-foreground mb-2">Verification Code</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input type="text" name="verificationCode" id="verificationCode" required value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="123456" />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500 bg-red-900/30 p-3 rounded-lg text-center">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-lg text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:ring-blue-500">
                        {loading ? 'Creating Account...' : 'Create Account & Verify'}
                    </button>
                </form>
            )}

            <p className="text-center text-sm text-muted-foreground mt-8">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-primary hover:underline">
                    Log In
                </Link>
            </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default SignupPage; 