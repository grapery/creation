# Grapery Creation Web

Grapery 的用户侧 Web 创作站：故事 / 故事板 / 碎片的浏览与消费、个人主页、
OAuth 登录（Apple / Google / 微信）、会员订阅与 Web 支付（Stripe / 微信 Native），
以及故事板创作向导。与 iOS 主 App（voyager）共享同一套后端。

## 技术栈

- **框架**：Next.js 16（App Router, standalone 输出）+ React 19
- **UI**：Tailwind CSS 4 + Radix UI + lucide-react + framer-motion
- **语言**：TypeScript；i18n 三语（简中 / English / 日本語，见 `lib/i18n/`）
- **支付**：Stripe.js（`components/payment/payment-dialog.tsx`）

## 快速开始

```bash
npm install
npm run dev        # http://localhost:3000
```

生产构建：

```bash
npm run build      # output: 'standalone'
npm start
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8080` | grapery 主服务（BFF route 使用） |
| `GRAPERY_ORIGIN` | `http://127.0.0.1:8080` | grapery 主服务（rewrite 代理目标） |
| `VIPPAY_ORIGIN` | `http://127.0.0.1:8060` | vippay 支付服务 |
| `AGENT_ORIGIN` / `GRAPERY_AGENT_ORIGIN` | `http://127.0.0.1:9020` | grapery-agent 创作服务 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | — | Stripe 前端密钥（可选，镜像 vippay 配置） |
| `COMMIT_SHA` | `build-<ts>` | 构建版本号 |

## 后端对接架构

浏览器只访问同源 `/api/*`，由 Next.js 分发（见 `next.config.ts` 的 rewrites）：

| 前端路径 | 目标 | 说明 |
|----------|------|------|
| `/api/v1/*` | `${GRAPERY_ORIGIN}/api/v1/*` | 主业务 API 直通 |
| `/api/vippay/*` | `${VIPPAY_ORIGIN}/api/vippay/*` | 支付 / OAuth / VIP |
| `/api/agent/*` | `${AGENT_ORIGIN}/api/v1/agent/*` | 创作会话流（预留） |
| `/api/auth/*`, `/api/public/*` | grapery 对应路径 | 公开接口 |
| `/api/*`（其余） | `${GRAPERY_ORIGIN}/api/v1/*` | 旧路径归一化 |
| `app/api/**/route.ts` | Next.js BFF | 少量需要服务端处理的接口 |

登录态：JWT + refresh token 存 `localStorage`，axios 拦截器统一注入
`Authorization` 并处理 401 刷新（`lib/api/client.ts`）。

## 相关文档

- [API_ALIGNMENT.md](./API_ALIGNMENT.md) — 前后端接口对齐说明
- [PAYMENT_SETUP.md](./PAYMENT_SETUP.md) — Web 支付（Stripe / 微信）配置
- [DEPLOYMENT.md](./DEPLOYMENT.md) — 部署流程
