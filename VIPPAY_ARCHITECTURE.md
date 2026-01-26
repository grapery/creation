# VIPPay 服务架构说明

## 服务概述

VIPPay 是一个独立的微服务，专门处理 Voyager 平台的所有支付相关操作。

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        前端层                                │
│                   Next.js Web App                            │
│                   (Port 3000)                                │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                      API 网关层                               │
│              Nginx / API Gateway (可选)                       │
└───────────┬──────────────────────────────────────┬───────────┘
            │                                      │
            ▼                                      ▼
┌──────────────────────┐            ┌─────────────────────────┐
│   主后端服务          │            │   VIPPay 服务           │
│   (Port 8080)        │            │   (Port 8081)           │
│                      │            │                         │
│ - 用户管理           │            │ - 支付处理               │
│ - 故事管理           │            │ - 支付历史记录           │
│ - 角色管理           │            │ - Webhook 接收          │
│ - 群组管理           │            │ - 支付通知               │
└──────────────────────┘            └──────────┬──────────────┘
                                               │
                    ┌──────────────────────────┼──────────────┐
                    │                          │              │
                    ▼                          ▼              ▼
            ┌─────────────┐         ┌──────────────┐  ┌─────────┐
            │   Stripe    │         │   Alipay     │  │  通知   │
            │    API      │         │     API      │  │  服务   │
            └─────────────┘         └──────────────┘  └─────────┘

                    ┌──────────────────────────────────────┐
                    │          PostgreSQL 数据库            │
                    │          (Port 5432)                 │
                    │  - payments 表                      │
                    │  - payment_notifications 表           │
                    └──────────────────────────────────────┘
```

## 数据流

### 支付创建流程

```
1. 用户在 VIP 页面选择计划
   ↓
2. 前端调用 POST /api/payments/create (Next.js API Route)
   ↓
3. Next.js 转发到 VIPPay: POST http://vippay:8081/api/payments
   ↓
4. VIPPay 创建支付记录，返回 clientSecret
   ↓
5. 前端使用 Stripe Elements 完成支付
   ↓
6. Stripe 发送 webhook 到 VIPPay
   ↓
7. VIPPay 更新支付状态，发送通知
```

### 支付历史查询流程

```
1. 用户访问 /payment-history 页面
   ↓
2. 前端调用 GET /api/payments/history (Next.js API Route)
   ↓
3. Next.js 转发到 VIPPay: GET http://vippay:8081/api/users/{userId}/payments
   ↓
4. VIPPay 查询数据库，返回支付记录
   ↓
5. 前端显示支付历史列表
```

## 服务职责划分

### 主后端服务 (Port 8080)
**负责**:
- 用户认证和授权
- 业务逻辑处理
- 数据管理
- 其他非支付相关功能

**不处理**:
- 支付创建
- 支付状态更新
- 支付历史查询

### VIPPay 服务 (Port 8081)
**负责**:
- ✅ 支付记录创建
- ✅ 支付状态管理
- ✅ 支付历史查询
- ✅ 支付通知发送
- ✅ Webhook 处理
- ✅ 与第三方支付提供商集成

**不处理**:
- 用户认证 (依赖主后端验证)
- 业务逻辑

## API 端点映射

### Next.js API Routes (前端层)
- `POST /api/payments/create` → VIPPay `POST /api/payments`
- `GET /api/payments/history` → VIPPay `GET /api/users/:id/payments`
- `GET /api/payments/:id/status` → VIPPay `GET /api/payments/:id/status`

### VIPPay Service (支付服务)
- `POST /api/payments` - 创建支付记录
- `GET /api/payments/:id` - 获取支付详情
- `PATCH /api/payments/:id` - 更新支付状态
- `GET /api/users/:id/payments` - 获取用户支付历史
- `POST /api/notifications/payment` - 发送支付通知
- `POST /api/webhooks/stripe` - Stripe webhook
- `POST /api/webhooks/alipay` - Alipay webhook

## 通信方式

### 认证
VIPPay 服务接受两种认证方式:

1. **JWT Token** (来自主后端)
   - 用于用户相关请求
   - 从 Authorization header 中获取
   - 可选：向主后端验证 token

2. **API Key** (服务间通信)
   - 用于 Next.js → VIPPay 通信
   - 从 X-API-Key header 中获取
   - 用于通知发送等内部操作

### 数据库
- VIPPay 和主后端共享同一个 PostgreSQL 数据库
- VIPPay 只访问支付相关表:
  - `payments`
  - `payment_notifications`
- 主后端访问其他业务表

## 部署配置

### 环境变量

**VIPPay 服务**:
```env
VIPPAY_PORT=8081
DATABASE_URL=postgres://...
STRIPE_SECRET_KEY=sk_...
API_KEY=vippay_internal_key
```

**Next.js (前端)**:
```env
VIPPAY_SERVICE_URL=http://localhost:8081
```

### 服务发现

使用以下任一方式:
1. **Docker Compose**: 服务名解析 (`http://vippay:8081`)
2. **Kubernetes**: Service DNS (`http://vippay-service.voyager.svc.cluster.local:8081`)
3. **环境变量**: 直接配置 URL

## 监控和日志

### VIPPay 服务日志
```json
{
  "timestamp": 1706659200000,
  "level": "info",
  "service": "vippay",
  "action": "create_payment",
  "payment_id": "pay_xxx",
  "user_id": "user_xxx",
  "amount": 999,
  "status": "pending"
}
```

### 关键指标
- 支付成功率
- 支付处理时间
- API 响应时间
- Webhook 处理延迟
- 错误率

## 扩展性

VIPPay 服务支持水平扩展:
- 无状态设计
- 支持多实例部署
- 使用 PostgreSQL 连接池
- 使用 Redis 缓存 (可选)

## 安全考虑

1. **API 通信**
   - 生产环境使用 HTTPS
   - API Key 轮换机制
   - 请求速率限制

2. **Webhook 验证**
   - Stripe webhook 签名验证
   - Alipay 签名验证
   - 防重放攻击

3. **数据保护**
   - 敏感数据加密存储
   - PCI DSS 合规 (如适用)
   - 定期安全审计

## 故障处理

### VIPPay 服务不可用
- 前端显示友好错误信息
- 支付功能暂时不可用
- 不影响其他功能

### 数据库连接失败
- 服务返回 503 错误
- 自动重试机制
- 降级到只读模式

### 第三方支付 API 失败
- 记录错误日志
- 通知管理员
- 重试机制 (适用场景)
