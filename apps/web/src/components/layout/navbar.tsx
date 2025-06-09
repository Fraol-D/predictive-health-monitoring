'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { BellIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/providers/auth-provider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const Navbar = () => {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <nav className="w-full max-w-6xl mb-8 p-3 bg-card/80 backdrop-blur-md rounded-xl shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Predictive Health
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link 
            href="/assessment" 
            className={`text-sm transition-colors ${isActive('/assessment') ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
          >
            Assessment
          </Link>
          <Link 
            href="/report" 
            className={`text-sm transition-colors ${isActive('/report') ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
          >
            Reports
          </Link>
          <Link 
            href="/recommendations" 
            className={`text-sm transition-colors ${isActive('/recommendations') ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
          >
            Recommendations
          </Link>
          <Link 
            href="/chat" 
            className={`text-sm transition-colors ${isActive('/chat') ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
          >
            Chat
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {!loading && user ? (
            <>
              <Link href="/notifications" className="relative">
                <BellIcon className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                {/* TODO: Add notification badge */}
              </Link>
              <Link href="/profile">
                <UserIcon className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <button onClick={handleLogout} className="text-muted-foreground hover:text-primary">
                <ArrowRightOnRectangleIcon className="w-6 h-6" />
              </button>
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
      </div>
    </nav>
  );
};

export default Navbar; 