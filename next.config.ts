import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone output for Netlify - use default static export
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Enable compression and optimization
  compress: true,
  poweredByHeader: false,
  // Optimize for static export
  trailingSlash: false,
  // Remove server-side specific config for static export
  // allowedDevOrigins: ['app-cosmic.com', '*.app-cosmic.com', 'vibecode.net', '*.vibecode.net'],
};

export default nextConfig;