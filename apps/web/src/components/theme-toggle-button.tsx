'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

// Simple SVG Icons
const SunIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export function ThemeToggleButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  console.log('[ThemeToggleButton] Render. Mounted:', mounted, 'Theme:', theme, 'ResolvedTheme:', resolvedTheme);

  React.useEffect(() => {
    setMounted(true);
    console.log('[ThemeToggleButton] Mounted effect ran.');
  }, []);

  if (!mounted) {
    console.log('[ThemeToggleButton] Not mounted, rendering placeholder.');
    return <div style={{ width: '2.25rem', height: '2.25rem' }} />;
  }

  const currentDisplayTheme = resolvedTheme || theme;
  console.log('[ThemeToggleButton] CurrentDisplayTheme:', currentDisplayTheme);

  const handleToggle = () => {
    const newTheme = currentDisplayTheme === 'light' ? 'dark' : 'light';
    console.log(`[ThemeToggleButton] Clicked! CurrentDisplayTheme: ${currentDisplayTheme}, Attempting to set theme to: ${newTheme}`);
    setTheme(newTheme);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      aria-label={currentDisplayTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className="rounded-lg p-2 w-9 h-9 flex items-center justify-center transition-colors"
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
 