import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CosmicAnalyticsProvider } from "cosmic-analytics";
import Navbar from "@/app/components/Navbar";

const primaryFont = Geist({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

// Change the title and description to your own.
export const metadata: Metadata = {
  title: "Chirag Sahani - Portfolio",
  description: "Welcome to my portfolio website showcasing my work and skills.",
};

export default function RootLayout({
  children,
  
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body className="antialiased">
        <main className="h-screen">
          <Navbar />
          <CosmicAnalyticsProvider>
            {children}
          </CosmicAnalyticsProvider>
        </main>
      </body>
    </html>
  );
}