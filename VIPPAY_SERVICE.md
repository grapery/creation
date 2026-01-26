# VIPPay Service Documentation

VIPPay is a dedicated microservice for handling payment operations in the Voyager platform. It manages payment processing, history tracking, and notifications for membership subscriptions.

## Service Overview

**Purpose**: Handle all payment-related operations for VIP membership subscriptions
**Port**: 8081 (configurable via environment variable)
**Database**: PostgreSQL (shared with main backend or separate)

## API Endpoints

### 1. Create Payment Record
```
POST /api/payments
```

**Request Body**:
```json
{
  "userId": "string",
  "planId": "string",
  "amount": 100,
  "currency": "USD",
  "method": "stripe",
  "status": "pending",
  "metadata": {
    "productName": "Pro Monthly",
    "productDescription": "Professional membership",
    "trialDays": 14
  },
  "stripePaymentIntentId": "pi_xxx",
  "alipayOutTradeNo": "xxx"
}
```

**Response**: `201 Created`
```json
{
  "id": "pay_xxx",
  "userId": "string",
  "planId": "string",
  "amount": 100,
  "currency": "USD",
  "status": "pending",
  "method": "stripe",
  "createdAt": 1706659200000,
  "updatedAt": 1706659200000,
  "metadata": {...}
}
```

### 2. Get Payment Details
```
GET /api/payments/:paymentId
```

**Response**: `200 OK`
```json
{
  "id": "pay_xxx",
  "userId": "string",
  "planId": "string",
  "amount": 100,
  "currency": "USD",
  "status": "succeeded",
  "method": "stripe",
  "createdAt": 1706659200000,
  "updatedAt": 1706659800000,
  "metadata": {...}
}
```

### 3. Update Payment Status
```
PATCH /api/payments/:paymentId
```

**Request Body**:
```json
{
  "status": "succeeded",
  "metadata": {
    "stripePaymentIntentId": "pi_xxx"
  },
  "updatedAt": 1706659800000
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "payment": {...}
}
```

### 4. Get User Payment History
```
GET /api/users/:userId/payments
```

**Query Parameters**:
- `limit` (default: 20)
- `offset` (default: 0)
- `status` (optional: pending, succeeded, failed, refunded)
- `method` (optional: stripe, google_pay, apple_pay, alipay)
- `startDate` (optional: timestamp)
- `endDate` (optional: timestamp)

**Response**: `200 OK`
```json
{
  "payments": [
    {
      "id": "pay_xxx",
      "userId": "string",
      "planId": "pro_month",
      "amount": 999,
      "currency": "USD",
      "status": "succeeded",
      "method": "stripe",
      "createdAt": 1706659200000,
      "updatedAt": 1706659200000,
      "metadata": {
        "productName": "Pro Monthly"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

### 5. Send Payment Notification
```
POST /api/notifications/payment
```

**Request Body**:
```json
{
  "userId": "string",
  "type": "PAYMENT_SUCCESS",
  "data": {
    "type": "PAYMENT_SUCCESS",
    "paymentId": "pay_xxx",
    "amount": 999,
    "currency": "USD",
    "planId": "pro_month"
  }
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "notificationId": "notif_xxx"
}
```

## Database Schema

### Payments Table

```sql
CREATE TABLE payments (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    plan_id VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    method VARCHAR(50) NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    metadata JSONB,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    alipay_out_trade_no VARCHAR(255) UNIQUE,

    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_method (method),
    INDEX idx_created_at (created_at)
);
```

### Payment Notifications Table

```sql
CREATE TABLE payment_notifications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    data JSONB NOT NULL,
    sent_at BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',

    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_sent_at (sent_at)
);
```

## Configuration

### Environment Variables

```env
# Service
VIPPAY_PORT=8081
VIPPAY_HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/voyager

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Alipay
ALIPAY_APP_ID=your_app_id
ALIPAY_PRIVATE_KEY=your_private_key
ALIPAY_PUBLIC_KEY=alipay_public_key
ALIPAY_GATEWAY_URL=https://openapi.alipay.com/gateway.do

# Notification Service
NOTIFICATION_SERVICE_URL=http://localhost:8082/api/notifications

# Main Backend (for user verification)
MAIN_BACKEND_URL=http://localhost:8080

# Security
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key
```

## Service Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Next.js)      │
└────────┬────────┘
         │
         │ HTTP API
         ▼
┌─────────────────┐
│   VIPPay        │
│   Service       │
│   (Port 8081)   │
└────────┬────────┘
         │
         ├──────────┐
         │          │
         ▼          ▼
    ┌────────┐ ┌──────────────┐
    │ Stripe │ │  Alipay API  │
    │  API   │ │              │
    └────────┘ └──────────────┘

         │
         ▼
    ┌─────────┐
    │Database │
    │PostgreSQL│
    └─────────┘
```

## Technology Stack

**Recommended**:
- **Language**: Go 1.21+ or Node.js 20+
- **Framework**:
  - Go: Gin or Fiber
  - Node.js: Express or Fastify
- **Database**: PostgreSQL 15+
- **ORM**:
  - Go: GORM
  - Node.js: Prisma or TypeORM
- **Payment SDKs**:
  - Stripe Go/Node SDK
  - Alipay SDK

## Example Implementation (Go with Gin)

See `vippay-service/` directory for complete implementation.

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing or invalid API key |
| 404 | Not Found - Payment or user not found |
| 409 | Conflict - Payment already exists |
| 500 | Internal Server Error |
| 502 | Bad Gateway - Payment provider error |
| 503 | Service Unavailable - Database error |

## Webhooks

### Stripe Webhook

```
POST /api/webhooks/stripe
```

The service should handle Stripe webhooks for:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

Verify webhook signature using `STRIPE_WEBHOOK_SECRET`.

### Alipay Webhook

```
POST /api/webhooks/alipay
```

Handle Alipay async notifications:
- Payment success
- Payment failed
- Refund notification

## Monitoring & Logging

**Metrics to Track**:
- Payment success rate
- Payment failure reasons
- Average processing time
- Payment method distribution
- Revenue per period

**Logs**:
- All payment requests
- Payment provider API calls
- Errors and exceptions
- Webhook receipts

## Security

1. **API Authentication**:
   - JWT tokens from main backend
   - API key for service-to-service communication

2. **Webhook Verification**:
   - Verify Stripe webhook signatures
   - Verify Alipay signatures

3. **Data Encryption**:
   - Encrypt sensitive payment data at rest
   - Use TLS for all communications

4. **Rate Limiting**:
   - Limit payment creation attempts
   - Prevent webhook flooding

## Testing

### Unit Tests
```bash
go test ./...
```

### Integration Tests
```bash
go test -tags=integration ./tests/integration/
```

### Load Testing
```bash
k6 run tests/load/payment-creation.js
```

## Deployment

### Docker
```bash
docker build -t vippay-service:latest .
docker run -p 8081:8081 vippay-service:latest
```

### Kubernetes
See `k8s/deployment.yaml` for Kubernetes configuration.

## Health Check

```
GET /health
```

**Response**: `200 OK`
```json
{
  "status": "healthy",
  "database": "connected",
  "stripe": "connected",
  "timestamp": 1706659200000
}
```

## Version History

- **v1.0.0** - Initial release with Stripe and Alipay support
- **v1.1.0** - Added Google Pay and Apple Pay
- **v1.2.0** - Added payment notifications
- **v1.3.0** - Added payment history filtering and export

## Support

For issues and questions:
- GitHub Issues: [project-url]/issues
- Email: vippay-support@example.com
