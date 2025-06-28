'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { BellIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/providers/auth-provider';

const Navbar = () => {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/assessment', label: 'Assessment' },
    { href: '/report', label: 'Reports' },
    { href: '/recommendations', label: 'Recommendations' },
    { href: '/chat', label: 'Chat' },
  ];

  return (
    <nav className="w-full max-w-6xl mb-8 p-3 bg-card/80 backdrop-blur-md rounded-xl shadow-lg relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Predictive Health
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`text-sm transition-colors ${isActive(link.href) ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side icons & Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {!loading && user ? (
            <>
              <Link href="/notifications" className="relative p-1">
                <BellIcon className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                {/* Notification Badge */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                  3
                </div>
              </Link>
              <Link href="/profile" className="p-1">
                <UserIcon className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </>
          ) : !loading ? (
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90">
                Login
              </button>
            </Link>
          ) : null}
          <ThemeToggleButton />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <ThemeToggleButton />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="ml-2">
            {isMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 p-4 bg-card/90 rounded-lg absolute top-full left-0 right-0 z-20">
          <div className="flex flex-col space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base transition-colors ${isActive(link.href) ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border my-2"></div>
            {!loading && user ? (
              <div className="flex flex-col space-y-4">
                 <Link href="/notifications" onClick={() => setIsMenuOpen(false)}>
                  <div className="relative flex items-center gap-2 text-foreground hover:text-primary">
                    <BellIcon className="w-6 h-6" />
                    <span>Notifications</span>
                    {/* Notification Badge */}
                    <div className="absolute top-0 left-5 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                      3
                    </div>
                  </div>
                 </Link>
                 <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                   <div className="flex items-center gap-2 text-foreground hover:text-primary">
                    <UserIcon className="w-6 h-6" />
                    <span>Profile</span>
                   </div>
                 </Link>
              </div>
            ) : !loading ? (
              <Link href="/login">
                <button className="w-full px-4 py-2 text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90">
                  Login
                </button>
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
