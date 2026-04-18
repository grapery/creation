import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',

  generateBuildId: async () => {
    return process.env.COMMIT_SHA || `build-${Date.now()}`;
  },

  async rewrites() {
    return [
      // === DO NOT proxy these — handled by Next.js BFF routes ===
      // /api/auth/me → app/api/auth/me/route.ts
      // /api/users/:id (exact) → app/api/users/[id]/route.ts

      // === Auth routes (public, /api/auth/* — no /v1/) ===
      {
        source: '/api/auth/:path*',
        destination: 'http://127.0.0.1:8080/api/auth/:path*',
      },

      // === Public routes (no /v1/) ===
      {
        source: '/api/public/:path*',
        destination: 'http://127.0.0.1:8080/api/public/:path*',
      },
      {
        source: '/api/invitation-codes/validate',
        destination: 'http://127.0.0.1:8080/api/invitation-codes/validate',
      },

      // === Already has /v1/ — pass through directly ===
      {
        source: '/api/v1/:path*',
        destination: 'http://127.0.0.1:8080/api/v1/:path*',
      },

      // === Catch-all: frontend /api/xxx → backend /api/v1/xxx ===
      // Transforms old paths (/api/stories) to backend's authenticated routes (/api/v1/stories)
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8080/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
