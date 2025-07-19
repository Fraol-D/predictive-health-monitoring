'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, Phone, ShieldCheck, User, RefreshCw, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  PhoneAuthProvider,
  RecaptchaVerifier,
  multiFactor,
  PhoneMultiFactorGenerator,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

type UiState = 'register' | 'verifyEmail' | 'verifyPhone';

const googleProvider = new GoogleAuthProvider();

const SignupPage = () => {
  const [uiState, setUiState] = useState<UiState>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (uiState === 'register') {
      const container = document.getElementById('recaptcha-container-signup');
      if (container) {
        container.innerHTML = '';
      }
    }
  }, [uiState]);

  const checkEmailVerification = useCallback(async (firebaseUser: FirebaseUser) => {
    await firebaseUser.reload();
    if (firebaseUser.emailVerified) {
      setUser(firebaseUser); // Save user for MFA
      setUiState('verifyPhone');
      setMessage('Email verified! Please proceed with phone verification.');
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (uiState === 'verifyEmail' && user) {
      interval = setInterval(async () => {
        const isVerified = await checkEmailVerification(user);
        if (isVerified && interval) {
          clearInterval(interval);
        }
      }, 3000); // Poll every 3 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [uiState, user, checkEmailVerification]);

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Step 1: Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      setUser(firebaseUser); // Save user for polling and MFA

      // Step 2: Update profile
      await updateProfile(firebaseUser, { displayName });

      // Step 3: Send verification email
      await sendEmailVerification(firebaseUser);
      
      setUiState('verifyEmail');
      setMessage('Registration successful! A verification link has been sent to your email. Please verify to continue.');

    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use by another account.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak. Please use at least 6 characters.';
      }
      console.error('Registration error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        setUser(firebaseUser); // Save user for MFA
        
        // Since Google auth implies a verified email, we can skip the email verification step
        setUiState('verifyPhone');
        setMessage('Account created with Google! Please secure your account with phone verification.');

    } catch (err: any) {
        let errorMessage = 'Failed to sign up with Google. Please try again.';
        if (err.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign-up process was cancelled.';
        }
        setError(errorMessage);
        console.error('Google Sign-up Error:', err);
    } finally {
        setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user) {
      setError('No user session found. Please try registering again.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await sendEmailVerification(user);
      setMessage('A new verification email has been sent.');
    } catch (error) {
      console.error('Error resending verification email:', error);
      setError('Failed to resend verification email. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerificationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setError('User session lost. Please log in again.');
        return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-signup', {
            'size': 'invisible',
        });
        
        const multiFactorSession = await multiFactor(user).getSession();
        const phoneInfoOptions = {
            phoneNumber,
            session: multiFactorSession
        };

        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const newVerificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
        
        setVerificationId(newVerificationId);
        setMessage('Verification code sent to your phone.');
    } catch (err: any) {
        console.error('Phone verification sending error:', err);
        setError('Failed to send verification code. Please check your phone number and try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleMfaEnrollmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !verificationId) {
        setError('Verification session is invalid. Please try again.');
        return;
    }
    setLoading(true);
    setError('');

    try {
        const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneCredential);
        await multiFactor(user).enroll(multiFactorAssertion, displayName);

        setMessage('Account created and verified successfully!');
        setTimeout(() => router.push('/'), 2000);

    } catch (err: any) {
        let errorMessage = 'An unexpected error occurred during MFA setup.';
        if (err.code === 'auth/invalid-verification-code') {
            errorMessage = 'The verification code is invalid. Please try again.';
        }
        console.error('MFA Enrollment error:', err);
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  const getPageTitle = () => {
    switch (uiState) {
        case 'register': return 'Create Your Account';
        case 'verifyEmail': return 'Verify Your Email';
        case 'verifyPhone': return 'Set Up 2-Step Verification';
        default: return 'Sign Up';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div id="recaptcha-container-signup"></div>
      <div className="w-full max-w-md">
        <div className="bg-card/80 backdrop-blur-lg rounded-xl shadow-2xl p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    {getPageTitle()}
                </h1>
                <p className="text-muted-foreground">
                    {uiState === 'register' && 'Join to start your health journey.'}
                    {uiState === 'verifyEmail' && `A verification link was sent to ${email}.`}
                    {uiState === 'verifyPhone' && 'Secure your account with a phone number.'}
                </p>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-900/30 p-3 rounded-lg text-center mb-4">{error}</p>}
            {message && <p className="text-sm text-green-500 bg-green-900/30 p-3 rounded-lg text-center mb-4">{message}</p>}
            
            {uiState === 'register' && (
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
                            <input type={showPassword ? 'text' : 'password'} name="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="••••••••" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-lg text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 focus:ring-pink-500">
                        {loading ? 'Creating Account...' : 'Register with Email'}
                    </button>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-card text-muted-foreground">
                            Or continue with
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleGoogleSignUp}
                        disabled={loading}
                        className="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm disabled:opacity-50 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-transform duration-300 ease-in-out"
                    >
                        {loading ? 'Processing...' : 'Sign up with Google'}
                    </button>
                </form>
            )}

            {uiState === 'verifyEmail' && (
                <div className="text-center space-y-6">
                    <p className="text-muted-foreground">Please check your inbox (and spam folder) and click the verification link to continue.</p>
                    <div className="flex items-center justify-center space-x-2 text-primary">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Waiting for verification...</span>
                    </div>
                    <button onClick={handleResendVerification} disabled={loading} className="w-full px-6 py-3 rounded-lg text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 focus:ring-gray-500">
                        {loading ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                </div>
            )}

            {uiState === 'verifyPhone' && (
                <div>
                    <form onSubmit={handlePhoneVerificationRequest} className="space-y-4 mb-4">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input type="tel" name="phone" id="phone" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="+1 650 555 1234" />
                            </div>
                        </div>
                        <button type="submit" disabled={loading || !!verificationId} className="w-full px-6 py-3 rounded-lg text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 focus:ring-cyan-500">
                            {loading ? 'Sending Code...' : 'Send Verification Code'}
                        </button>
                    </form>
                    
                    {verificationId && (
                        <form onSubmit={handleMfaEnrollmentSubmit} className="space-y-4 border-t border-border pt-4 mt-4">
                            <div>
                                <label htmlFor="verificationCode" className="block text-sm font-medium text-muted-foreground mb-2">Verification Code</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input type="text" name="verificationCode" id="verificationCode" required value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="123456" />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-lg text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 focus:ring-teal-500">
                                {loading ? 'Verifying...' : 'Verify & Complete Sign Up'}
                            </button>
                        </form>
                    )}
                </div>
            )}

            <p className="text-center text-sm text-muted-foreground mt-8">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-primary hover:underline">
                    Log In
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
