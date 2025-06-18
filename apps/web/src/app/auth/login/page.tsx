'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { 
    signInWithEmailAndPassword,
    sendEmailVerification,
    getMultiFactorResolver,
    PhoneAuthProvider,
    RecaptchaVerifier,
    PhoneMultiFactorGenerator,
    User as FirebaseUser,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const googleProvider = new GoogleAuthProvider();

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    // State for MFA flow
    const [uiState, setUiState] = useState<'login' | 'mfa' | 'verifyEmail'>('login');
    const [mfaResolver, setMfaResolver] = useState<any>(null);
    const [verificationId, setVerificationId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        if (uiState === 'mfa' && mfaResolver) {
            const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {} // reCAPTCHA solved
            });

            recaptchaVerifier.verify().then(() => {
                const phoneInfoOptions = {
                    multiFactorHint: mfaResolver.hints[0], // Assuming the first hint is always phone
                    session: mfaResolver.session
                };
                const phoneAuthProvider = new PhoneAuthProvider(auth);
                phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
                    .then(newVerificationId => {
                        setVerificationId(newVerificationId);
                        setLoading(false); // Now waiting for user to enter code
                        setError(''); // Clear previous errors
                    })
                    .catch(err => {
                        setError('Failed to send verification code. Please try again.');
                        console.error("MFA SMS Error:", err);
                        setLoading(false);
                        setUiState('login');
                    });
            }).catch(err => {
                setError('reCAPTCHA verification failed. Please try again.');
                console.error("reCAPTCHA Error:", err);
                setLoading(false);
                setUiState('login');
            });
        }
    }, [uiState, mfaResolver]);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                setUiState('verifyEmail');
                setMessage('Please verify your email before logging in. A new verification email has been sent.');
                await sendEmailVerification(user);
                setLoading(false);
                return;
            }

            router.push('/');
        } catch (err: any) {
            if (err.code === 'auth/multi-factor-auth-required') {
                const resolver = getMultiFactorResolver(auth, err);
                setMfaResolver(resolver);
                setUiState('mfa');
                // useEffect will now trigger to send SMS
            } else {
                let errorMessage = "Failed to log in. Please check your credentials.";
                if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                    errorMessage = "Invalid email or password. Please try again.";
                } else {
                    console.error("Firebase Login Error:", err);
                }
                setError(errorMessage);
                setLoading(false);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        setMessage(null);
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            // After successful sign-in, redirect to the home page.
            router.push('/');
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
    
    const handlePasswordReset = async () => {
        if (!email) {
            setError('Please enter your email address to reset your password.');
            return;
        }
        setError('');
        setMessage('');
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent. Please check your inbox.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!auth.currentUser) {
            setError('No user session found. Please try logging in again.');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await sendEmailVerification(auth.currentUser);
            setMessage('A new verification email has been sent.');
        } catch (error) {
            console.error('Error resending verification email:', error);
            setError('Failed to resend verification email. Please try again shortly.');
        } finally {
            setLoading(false);
        }
    };

    const handleMfaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
            const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
            await mfaResolver.resolveSignIn(multiFactorAssertion);
            router.push('/');
        } catch (err) {
            setError('Invalid verification code. Please try again.');
            console.error("MFA Resolve Error:", err);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div id="recaptcha-container"></div>
            <div className="w-full max-w-md">
                <div className="bg-card/80 backdrop-blur-lg rounded-xl shadow-2xl p-8">
                    {error && <p className="text-sm text-red-500 bg-red-900/30 p-3 rounded-lg text-center mb-4">{error}</p>}
                    {message && <p className="text-sm text-green-500 bg-green-900/30 p-3 rounded-lg text-center mb-4">{message}</p>}

                    {uiState === 'login' && (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                    Welcome Back
                                </h1>
                                <p className="text-muted-foreground">Log in to access your dashboard.</p>
                            </div>
                            <form onSubmit={handleLoginSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <input type="email" name="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-muted-foreground" placeholder="abebe@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <input type={showPassword ? 'text' : 'password'} name="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-muted-foreground" placeholder="••••••••" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <div className="text-right mt-2">
                                        <button type="button" onClick={handlePasswordReset} className="text-xs text-primary hover:underline">Forgot password?</button>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {loading ? 'Logging in...' : 'Log In with Email'}
                                </button>
                            </form>
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
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm disabled:opacity-50 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-transform duration-300 ease-in-out"
                            >
                                {loading ? 'Processing...' : 'Sign in with Google'}
                            </button>
                            <p className="text-center text-sm text-muted-foreground mt-8">
                                Don&apos;t have an account?{' '}
                                <Link href="/auth/signup" className="font-medium text-primary hover:underline">Sign up</Link>
                            </p>
                        </>
                    )}

                    {uiState === 'verifyEmail' && (
                         <div className="text-center">
                            <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                                Email Verification Required
                            </h1>
                            <p className="text-muted-foreground mb-6">
                                You must verify your email address before you can sign in. Please check your inbox for a verification link.
                            </p>
                            <button 
                                onClick={handleResendVerification} 
                                disabled={loading}
                                className="w-full px-6 py-3 rounded-lg text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 focus:ring-gray-500"
                            >
                                {loading ? 'Sending...' : 'Resend Verification Email'}
                            </button>
                             <p className="text-center text-sm text-muted-foreground mt-8">
                                Already verified?{' '}
                                <button onClick={() => window.location.reload()} className="font-medium text-primary hover:underline">Refresh and try logging in again</button>
                            </p>
                        </div>
                    )}

                    {uiState === 'mfa' && (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                                    Two-Factor Authentication
                                </h1>
                                <p className="text-muted-foreground">A verification code has been sent to your phone.</p>
                            </div>
                            <form onSubmit={handleMfaSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="verificationCode" className="block text-sm font-medium text-muted-foreground mb-2">Verification Code</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <input type="text" name="verificationCode" id="verificationCode" required value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-muted-foreground" placeholder="123456" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 