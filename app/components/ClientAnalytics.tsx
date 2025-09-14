'use client';

import dynamic from "next/dynamic";

const LazyAnalytics = dynamic(
  () => import("cosmic-analytics").then(mod => ({ default: mod.CosmicAnalyticsProvider })),
  { ssr: false }
);

export default function ClientAnalytics({ children }: { children: React.ReactNode }) {
  return <LazyAnalytics>{children}</LazyAnalytics>;
}