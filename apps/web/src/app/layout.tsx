import type { Metadata } from "next";
// Fonts are now handled by AppBody if they affect className there, or keep here if only for <head>
// For simplicity, let's assume AppBody handles its own font classNames on <body>
// import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
import { AppBody } from "./app-body"; // Import the new client component

// Font definitions for <head> links or global fallbacks can remain if needed, but AppBody handles body classes.
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Health Monitor",
  description: "Predictive health monitoring system",
  keywords: ["health", "monitoring", "predictive", "chronic disease", "risk assessment"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* AppBody will now render the <body> tag and its contents */}
      <AppBody>{children}</AppBody>
    </html>
  );
}
