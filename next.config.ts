import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',

  images: {
    // UGC 图片来自 OSS / 第三方头像 / 支付二维码等多个已知与动态域名，
    // 统一经 Next 优化器代理；SVG 允许以保持与 <img> 时代一致的渲染行为。
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },

  generateBuildId: async () => {
    return process.env.COMMIT_SHA || `build-${Date.now()}`;
  },

  async redirects() {
    return [
      // iOS Universal Link share paths (singular) → web routes (plural); preserve signed query (?t=&exp=)
      { source: '/fragment/:id', destination: '/fragments/:id', permanent: false },
      { source: '/storyboard/:id', destination: '/storyboards/:id', permanent: false },
      { source: '/story/:id', destination: '/stories/:id', permanent: false },
      { source: '/character/:id', destination: '/characters/:id', permanent: false },
    ];
  },

  async rewrites() {
    const vippayOrigin = process.env.VIPPAY_ORIGIN || 'http://127.0.0.1:8060';
    const graperyOrigin = process.env.GRAPERY_ORIGIN || 'http://127.0.0.1:8080';
    const agentOrigin = process.env.AGENT_ORIGIN || process.env.GRAPERY_AGENT_ORIGIN || 'http://127.0.0.1:9020';

    return [
      // === DO NOT proxy these — handled by Next.js BFF routes ===
      // /api/users/:id (exact) → app/api/users/[id]/route.ts
      // /api/legal/terms → app/api/legal/terms/route.ts
      // /api/legal/privacy → app/api/legal/privacy/route.ts

      // === VIPPay (must be before catch-all — not under grapery /api/v1) ===
      {
        source: '/api/vippay/:path*',
        destination: `${vippayOrigin}/api/vippay/:path*`,
      },

      // === grapery-agent creation/chat streams (agent SERVER_PORT defaults to 9020) ===
      {
        source: '/api/agent/:path*',
        destination: `${agentOrigin}/api/v1/agent/:path*`,
      },

      // === Auth routes (public, /api/auth/* — no /v1/) ===
      {
        source: '/api/auth/:path*',
        destination: `${graperyOrigin}/api/auth/:path*`,
      },

      // === Public routes (no /v1/) ===
      {
        source: '/api/public/:path*',
        destination: `${graperyOrigin}/api/public/:path*`,
      },
      {
        source: '/api/invitation-codes/validate',
        destination: `${graperyOrigin}/api/invitation-codes/validate`,
      },

      // === Already has /v1/ — pass through directly ===
      {
        source: '/api/v1/:path*',
        destination: `${graperyOrigin}/api/v1/:path*`,
      },

      // === Catch-all: frontend /api/xxx… → backend /api/v1/xxx… ===
      // Transforms old paths (/api/stories) to backend's authenticated routes (/api/v1/stories)
      // :path* 匹配任意段数（单段 :path 会漏掉 /api/notifications/unread/count 这类多段路径导致 404）；
      // legal/vippay/agent/auth/public 等前缀已被上方更早的规则优先匹配，不受影响。
      {
        source: '/api/:path*',
        destination: `${graperyOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
