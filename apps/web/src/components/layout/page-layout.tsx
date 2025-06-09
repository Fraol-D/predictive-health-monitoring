import React from 'react';
import Navbar from './navbar';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  centeredContent?: boolean;
}

const PageLayout = ({ children, className = '', centeredContent = false }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8">
      <Navbar />
      <main className={`w-full max-w-6xl ${centeredContent ? 'flex flex-col items-center justify-center' : ''} ${className}`}>
        {children}
      </main>
      <footer className="w-full max-w-6xl mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Predictive Health Monitoring. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PageLayout; 