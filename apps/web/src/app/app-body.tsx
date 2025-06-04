'use client';

import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google"; // Import fonts here if they are needed for className

// It's good practice to keep font definitions with RootLayout or here if AppBody is the primary layout structure
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface AppBodyProps {
  children: React.ReactNode;
}

export function AppBody({ children }: AppBodyProps) {
  const pathname = usePathname();
  // const showNavbar = pathname !== '/assessment'; // Keep this logic if PageLayout is not used on /assessment
  // We need to know if /assessment uses PageLayout or not.
  // For now, assuming PageLayout is used everywhere except potentially /assessment.
  // If /assessment does not use PageLayout, it won't have a navbar after this change.
  // Let's assume the goal is for PageLayout to provide the navbar on all pages it's used.

  return (
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        storageKey="phm-app-theme"
        disableTransitionOnChange
      >
        <div className="flex min-h-screen flex-col">
          {/* {showNavbar && <Navbar />} */}{/* Navbar removed from here */}
          {/* main className adjustments based on showNavbar are also removed */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </ThemeProvider>
    </body>
  );
} 