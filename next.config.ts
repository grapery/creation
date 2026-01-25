import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  
  // Ensure static assets are properly handled
  generateBuildId: async () => {
    // Use commit SHA if available, otherwise use timestamp
    return process.env.COMMIT_SHA || `build-${Date.now()}`;
  },
  
  async rewrites() {
    return [
      // DO NOT proxy /api/auth/me - handled by Next.js API route
      // DO NOT proxy /api/users/{id} (exact match only) - handled by Next.js API route
      // Proxy all other API requests to backend (including /api/auth/* except /me)
      {
        source: '/api/:path((?!auth/me$|auth/|users/[^/]+$).)*',
        destination: 'http://127.0.0.1:8080/api/:path*',
      },
      // Special: Proxy auth routes to backend, but keep /api/auth/me in Next.js
      {
        source: '/api/auth/login',
        destination: 'http://127.0.0.1:8080/api/auth/login',
      },
      {
        source: '/api/auth/register',
        destination: 'http://127.0.0.1:8080/api/auth/register',
      },
      {
        source: '/api/auth/oauth/:path*',
        destination: 'http://127.0.0.1:8080/api/auth/oauth/:path*',
      },
    ];
  },
};

export default nextConfig;