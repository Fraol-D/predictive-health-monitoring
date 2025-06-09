'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/layout/page-layout';
import { Mail, KeyRound } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err: any) {
            let errorMessage = "Failed to log in. Please check your credentials.";
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                errorMessage = "Invalid email or password. Please try again.";
            } else {
                console.error("Firebase Login Error:", err);
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

  return (
    <PageLayout centeredContent>
      <div className="w-full max-w-md">
        <div className="bg-card/80 backdrop-blur-lg rounded-xl shadow-2xl p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    Welcome Back
                </h1>
                <p className="text-muted-foreground">Log in to access your dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-muted-foreground"
                        placeholder="abebe@example.com"
                    />
                </div>
            </div>

            <div>
                 <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">
                    Password
                </label>
                 <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-muted-foreground"
                        placeholder="••••••••"
                    />
                </div>
                <div className="text-right mt-2">
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                </Link>
                </div>
            </div>
            
            {error && <p className="text-sm text-red-500 bg-red-900/30 p-3 rounded-lg text-center">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? 'Logging in...' : 'Log In'}
            </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                Sign up
            </Link>
            </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginPage; 