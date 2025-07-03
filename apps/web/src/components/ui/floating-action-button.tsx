'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, HeartPulse, Share2, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Visibility Hook
// ============================================================================

export function useFabVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  const hiddenOnPages = ['/auth/login', '/signup', '/profile'];
  const isFabHiddenOnPage = hiddenOnPages.includes(pathname);

  useEffect(() => {
    if (isFabHiddenOnPage) {
      setIsVisible(false);
      return;
    }

    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname, isFabHiddenOnPage]);

  return !isFabHiddenOnPage && isVisible;
}


// ============================================================================
// Action Button Component
// ============================================================================

interface Action {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const actions: Action[] = [
  { href: '/assessment', label: 'New Assessment', icon: <HeartPulse className="w-6 h-6" /> },
  { href: '/data-sharing', label: 'Share Data', icon: <Share2 className="w-6 h-6" /> },
  { href: '/notifications', label: 'Notifications', icon: <Bell className="w-6 h-6" /> },
];

interface FloatingActionButtonProps {
  visible?: boolean;
}

export function FloatingActionButton({ visible = true }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "fixed bottom-8 right-8 z-50 transition-transform duration-300 ease-in-out",
        visible ? 'translate-y-0' : 'translate-y-24',
        "pointer-events-none" // Restrict clicks to children
      )}
    >
      <div className="relative flex flex-col items-center gap-3">
        {/* Action Buttons */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out flex flex-col items-center gap-3',
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          {actions.map((action) => (
            <Link href={action.href} key={action.href} className="pointer-events-auto">
              <div
                className="flex items-center gap-3 bg-card shadow-lg p-3 rounded-full cursor-pointer hover:bg-muted transition-all"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-sm font-medium text-foreground">{action.label}</span>
                <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-full text-primary">
                  {action.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 transform hover:scale-110 transition-all duration-200 pointer-events-auto"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close actions' : 'Open actions'}
        >
          <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
            <Plus className="w-8 h-8" />
          </div>
        </button>
      </div>
    </div>
  );
} 