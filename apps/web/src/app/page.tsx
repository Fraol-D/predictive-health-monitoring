import React from 'react';
import Link from 'next/link';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
// import { motion } from 'motion/react'; // Commenting out motion/react

const HomePage = () => {
  return (
    <>
      {/* <motion.div style={{ width: 50, height: 50, background: 'red' }} animate={{ scale: 1.2 }} /> */}{/* Basic motion test commented out*/}
      <div
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // transition={{ duration: 0.5 }}
        className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8"
      >
      {/* Navigation Placeholder (to be potentially moved to a layout component) */}
        <nav
          // initial={{ y: -50, opacity: 0 }}
          // animate={{ y: 0, opacity: 1 }}
          // transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-6xl mb-8 p-4 bg-card/80 backdrop-blur-md rounded-xl shadow-lg"
        >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Predictive Health
          </h1>
            <div className="flex items-center space-x-4">
              {/* Placeholder for Profile Icon */}
              <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors">
              Profile
            </button>
              <ThemeToggleButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
        <header
          // initial={{ scale: 0.9, opacity: 0 }}
          // animate={{ scale: 1, opacity: 1 }}
          // transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-6xl mb-12 text-center p-8 bg-card/50 backdrop-blur-sm rounded-xl shadow-md"
        >
        <h2 className="text-5xl font-bold mb-4">
          Take Control of Your Health
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Assess your chronic disease risks and get personalized insights.
        </p>
        <div>
          <Link href="/assessment">
            <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform">
              Start Assessment
            </button>
          </Link>
        </div>
      </header>

      {/* Recent Risk Cards Section */}
        <section
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full max-w-6xl mb-12"
        >
        <h3 className="text-3xl font-semibold mb-6 text-center md:text-left">Recent Assessments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder Card 1 */}
            <div
              // initial={{ y: 20, opacity: 0 }}
              // animate={{ y: 0, opacity: 1 }}
              // transition={{ duration: 0.4, delay: 0.7 }}
              // whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(168, 85, 247, 0.3)" }}
              className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-primary/30 transition-shadow"
            >
            <h4 className="text-xl font-semibold mb-2">Diabetes Risk</h4>
            <p className="text-sm text-muted-foreground mb-1">Assessed: 2 days ago</p>
            <p className="text-2xl font-bold text-yellow-400">Medium Risk (65%)</p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm w-full transition-colors">
              View Report
            </button>
          </div>
          {/* Placeholder Card 2 */}
            <div
              // initial={{ y: 20, opacity: 0 }}
              // animate={{ y: 0, opacity: 1 }}
              // transition={{ duration: 0.4, delay: 0.8 }}
              // whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(236, 72, 153, 0.3)" }}
              className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-accent/30 transition-shadow"
            >
            <h4 className="text-xl font-semibold mb-2">Heart Disease Risk</h4>
            <p className="text-sm text-muted-foreground mb-1">Assessed: 1 week ago</p>
            <p className="text-2xl font-bold text-green-400">Low Risk (30%)</p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-sm w-full transition-colors">
              View Report
            </button>
          </div>
          {/* Placeholder Card 3 (Empty State) */}
            <div
              // initial={{ y: 20, opacity: 0 }}
              // animate={{ y: 0, opacity: 1 }}
              // transition={{ duration: 0.4, delay: 0.9 }}
              className="bg-card/70 backdrop-blur-md p-6 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[180px] border-2 border-dashed border-border hover:border-primary/50 transition-colors"
            >
            <p className="text-muted-foreground mb-2">No new assessments</p>
            <Link href="/assessment">
              <button className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition-colors">
                Take New Assessment
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Buttons Section */}
        <section
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // transition={{ duration: 0.5, delay: 1.0 }}
          className="w-full max-w-6xl"
        >
        <h3 className="text-3xl font-semibold mb-6 text-center md:text-left">Explore</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow text-center">
            <h4 className="text-xl font-semibold mb-2">View Full History</h4>
            <p className="text-muted-foreground mb-4">Track your progress over time.</p>
            <button className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors">
              Go to History
            </button>
          </div>
          <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-accent/20 transition-shadow text-center">
            <h4 className="text-xl font-semibold mb-2">Get Recommendations</h4>
            <p className="text-muted-foreground mb-4">Personalized advice for a healthier you.</p>
            <button className="px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 transition-colors">
              See Recommendations
            </button>
          </div>
          {/* New AI Chat Link Card */}
          <Link href="/chat" className="md:col-span-1 lg:col-span-1">
            <div className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow text-center h-full flex flex-col justify-center items-center">
              <h4 className="text-xl font-semibold mb-2">AI Health Assistant</h4>
              <p className="text-muted-foreground mb-4">Chat directly with our AI.</p>
              <button className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors">
                Start Chatting
              </button>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer Placeholder */}
        <footer
          // initial={{ y: 50, opacity: 0 }}
          // animate={{ y: 0, opacity: 1 }}
          // transition={{ duration: 0.5, delay: 1.2 }}
          className="w-full max-w-6xl mt-12 pt-8 border-t border-border text-center text-muted-foreground"
        >
        <p>&copy; {new Date().getFullYear()} Predictive Health Monitoring. All rights reserved.</p>
        <p className="text-sm">Powered by AI with ❤️</p>
      </footer>
    </div>
    </>
  );
};

export default HomePage;
