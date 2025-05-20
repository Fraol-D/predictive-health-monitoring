import React from 'react';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md p-8 bg-slate-800/70 backdrop-blur-lg rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Welcome Back
        </h1>
        <p className="text-center text-slate-300 mb-8">Log in to access your dashboard</p>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
              placeholder="abebe@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 placeholder-slate-400"
              placeholder="••••••••"
            />
            <div className="text-right mt-1">
              <Link href="/auth/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="font-medium text-purple-400 hover:text-purple-300">
            Sign up
          </Link>
        </p>
      </div>
      <Link href="/" className="mt-8 text-sm text-purple-400 hover:text-purple-300">
        &larr; Back to Home
      </Link>
    </div>
  );
};

export default LoginPage; 