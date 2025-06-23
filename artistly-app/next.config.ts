import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@reduxjs/toolkit'],
  },
};

export default nextConfig;
