'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/layout/page-layout';
import { Mail, KeyRound, ShieldCheck } from 'lucide-react';
import { 
    signInWithEmailAndPassword,
    getMultiFactorResolver,
    PhoneAuthProvider,
    RecaptchaVerifier,
    PhoneMultiFactorGenerator
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // State for MFA flow
    const [uiState, setUiState] = useState<'login' | 'mfa'>('login');
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
        try {
            await signInWithEmailAndPassword(auth, email, password);
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
        <PageLayout centeredContent>
            <div id="recaptcha-container"></div>
            <div className="w-full max-w-md">
                <div className="bg-card/80 backdrop-blur-lg rounded-xl shadow-2xl p-8">
                    {uiState === 'login' ? (
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
                                        <input type="password" name="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-muted-foreground" placeholder="••••••••" />
                                    </div>
                                    <div className="text-right mt-2">
                                        <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                                    </div>
                                </div>
                                {error && <p className="text-sm text-red-500 bg-red-900/30 p-3 rounded-lg text-center">{error}</p>}
                                <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {loading ? 'Logging in...' : 'Log In'}
                                </button>
                            </form>
                            <p className="text-center text-sm text-muted-foreground mt-8">
                                Don&apos;t have an account?{' '}
                                <Link href="/auth/signup" className="font-medium text-primary hover:underline">Sign up</Link>
                            </p>
                        </>
                    ) : (
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
                                {error && <p className="text-sm text-red-500 bg-red-900/30 p-3 rounded-lg text-center">{error}</p>}
                                <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default LoginPage; 