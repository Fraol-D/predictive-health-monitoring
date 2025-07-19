import React from 'react';
import Navbar from "./navbar";
import { FloatingActionButton, useFabVisibility } from '../ui/floating-action-button';

interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function PageLayout({ children, title }: PageLayoutProps) {
    const isFabVisible = useFabVisibility();

    return (
        <div className="flex flex-col min-h-screen items-center">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {title && (
                     <header className="w-full mb-12">
                        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{title}</h1>
                     </header>
                )}
                {children}
            </main>
            {isFabVisible && <FloatingActionButton />}
        </div>
    );
} 