import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  async rewrites() {
    return [
      // DO NOT proxy /api/auth/* - handled by Next.js API routes
      // DO NOT proxy /api/users/{id} (exact match only) - handled by Next.js API route
      // Proxy all other API requests to backend
      {
        source: '/api/:path((?!auth/|users/[^/]+$).)*',
        destination: 'http://127.0.0.1:8080/api/:path*',
      },
    ]
  },
};

export default nextConfig;
