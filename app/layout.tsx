import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import ClientAnalytics from "@/app/components/ClientAnalytics";

const primaryFont = Geist({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: true,
});

// Enhanced metadata for performance
export const metadata: Metadata = {
  title: "Chirag Sahani - Portfolio",
  description: "Full-stack developer specializing in React, Node.js, and Three.js. View my projects and technical skills.",
  keywords: "developer, portfolio, React, Node.js, Three.js, full-stack",
  authors: [{ name: "Chirag Sahani" }],
  creator: "Chirag Sahani",
  openGraph: {
    title: "Chirag Sahani - Portfolio",
    description: "Full-stack developer portfolio showcasing modern web applications",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
  
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={primaryFont.className}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="https://res.cloudinary.com/dlyctssmy/image/upload/v1734845393/android-chrome-512x512_oh3h9a.png"
          as="image"
          type="image/png"
        />
      </head>
      <body className="antialiased">
        <main className="h-screen">
          <Navbar />
          <ClientAnalytics>
            {children}
          </ClientAnalytics>
        </main>
      </body>
    </html>
  );
}