'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/layout/page-layout';
import { Mail, KeyRound, User } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError('');
        
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // On successful signup, Firebase automatically signs the user in.
            // The AuthProvider will detect the change and update the context.
            // We can then redirect to the dashboard.
            router.push('/');
        } catch (err: any) {
            // Provide more user-friendly error messages
            let errorMessage = "Failed to create an account. Please try again.";
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = "This email address is already in use.";
            } else if (err.code === 'auth/weak-password') {
                errorMessage = "The password is too weak. Please choose a stronger password.";
            } else {
                console.error("Firebase Signup Error:", err);
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
                Create Account
                </h1>
                <p className="text-muted-foreground">Join Predictive Health Monitoring</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-muted-foreground mb-2">
                Full Name
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-muted-foreground"
                        placeholder="Abebe Bikila"
                    />
                </div>
            </div>

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
            </div>

             <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-muted-foreground"
                        placeholder="••••••••"
                    />
                </div>
            </div>
            
            {error && <p className="text-sm text-red-500 bg-red-900/30 p-3 rounded-lg text-center">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Log in
            </Link>
            </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default SignupPage; 