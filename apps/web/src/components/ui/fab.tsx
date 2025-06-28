'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, X, HeartPulse, Share2, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Fab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Define pages where the FAB should not be rendered
  const hiddenOnPages = ['/login', '/signup', '/assessment', '/chat'];

  if (hiddenOnPages.includes(pathname)) {
    return null;
  }

  const actions = [
    {
      href: '/assessment',
      label: 'New Assessment',
      icon: <HeartPulse className="w-6 h-6" />,
    },
    {
      href: '/data-sharing',
      label: 'Share Data',
      icon: <Share2 className="w-6 h-6" />,
    },
    {
      href: '/notifications',
      label: 'Notifications',
      icon: <Bell className="w-6 h-6" />,
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative flex flex-col items-center gap-3">
        {/* Action Buttons */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            {actions.map((action) => (
              <Link href={action.href} key={action.href}>
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
        </div>

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 transform hover:scale-110 transition-all duration-200"
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
};

export default Fab;
