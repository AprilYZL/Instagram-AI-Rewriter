import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5328/:path*', // Proxy to Backend
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true, // This will prevent ESLint from running during the build process.
  },
};

export default nextConfig;
