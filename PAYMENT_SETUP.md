# Payment System Setup Guide

This document explains how to set up and configure the payment system for the Voyager platform.

## Supported Payment Methods

The platform supports 4 payment methods:
1. **Stripe** - Credit/Debit Card payments
2. **Google Pay** - Fast payment via Google Pay
3. **Apple Pay** - Quick payment via Apple Pay
4. **Alipay** - Popular payment method in Asia

## Prerequisites

### 1. Stripe Setup

1. **Create a Stripe Account**
   - Go to [https://stripe.com](https://stripe.com)
   - Sign up for a new account
   - Verify your email and business details

2. **Get API Keys**
   - Navigate to Dashboard → Developers → API keys
   - Copy the **Publishable key** (starts with `pk_`)
   - Copy the **Secret key** (starts with `sk_`)

3. **Setup Webhooks** (Optional, for production)
   - Navigate to Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/payments/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.failed`

### 2. Alipay Setup (Optional)

1. **Create Alipay Developer Account**
   - Go to [https://open.alipay.com](https://open.alipay.com)
   - Sign up and create an application

2. **Get Credentials**
   - Generate and download your public/private key pair
   - Upload your public key to Alipay
   - Copy Alipay's public key
   - Note your App ID

### 3. Backend API Setup

Ensure your backend API is running and has the following endpoints:
- `POST /api/payments` - Create payment record
- `GET /api/payments/:id` - Get payment details
- `PATCH /api/payments/:id` - Update payment status
- `GET /api/users/:id/payments` - Get payment history
- `POST /api/notifications/payment` - Send payment notification

## Configuration

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Update the following variables:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Alipay (optional)
ALIPAY_APP_ID=your_app_id
ALIPAY_PRIVATE_KEY=your_private_key
ALIPAY_PUBLIC_KEY=alipay_public_key
ALIPAY_GATEWAY_URL=https://openapi.alipay.com/gateway.do

# Backend
BACKEND_URL=http://localhost:8080
```

### 2. Install Dependencies

The payment dependencies are already installed:
- `@stripe/stripe-js` - Stripe.js frontend library
- `@stripe/react-stripe-js` - React components for Stripe
- `stripe` - Stripe Node.js library

### 3. Backend Configuration

Your backend needs to handle payment webhooks and store payment records. Here's the expected schema:

#### Payment Record Schema

```typescript
{
  id: string;                    // Unique payment ID
  userId: string;                // User ID
  planId: string;                // Membership plan ID
  amount: number;                // Amount in cents
  currency: string;              // Currency code (USD, CNY, etc.)
  status: string;                // pending, succeeded, failed, etc.
  method: string;                // stripe, google_pay, apple_pay, alipay
  createdAt: number;             // Creation timestamp
  updatedAt: number;             // Last update timestamp
  metadata: {
    productName: string;
    productDescription: string;
    trialDays?: number;
  };
  stripePaymentIntentId?: string;
  alipayOutTradeNo?: string;
}
```

## Usage

### For Users

1. **Navigate to VIP Page**
   - Go to `/vip`
   - Browse available membership plans

2. **Select a Plan**
   - Click "Subscribe" on your preferred plan
   - Payment dialog will open

3. **Choose Payment Method**
   - Select from 4 payment options
   - Follow the payment instructions

4. **Complete Payment**
   - For Stripe/Google Pay/Apple Pay: Complete in-dialog payment
   - For Alipay: Redirect to Alipay page, then return

5. **Confirmation**
   - Upon success, you'll receive a notification
   - Your membership will be activated

### For Administrators

1. **View Payment History**
   - Go to Settings → Payment History
   - Filter by status, method, or date range
   - Export to CSV for accounting

2. **Manage Subscriptions**
   - View active subscriptions
   - Handle cancellations and refunds

## Testing

### Test Mode

All payment processors support test mode:

**Stripe Test Cards:**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Google Pay & Apple Pay:**
- Use test cards in your wallet
- Or use Stripe's test mode

**Alipay:**
- Use Alipay's sandbox environment

### Webhook Testing

Use Stripe CLI to test webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

## Security Considerations

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Enable webhook signatures** to verify requests
4. **Implement rate limiting** on payment endpoints
5. **Log all payment transactions** for audit trails
6. **Use HTTPS** in production
7. **Validate payment amounts** on the backend

## Troubleshooting

### Common Issues

1. **Stripe Payment Fails**
   - Check API keys are correct
   - Verify webhook secret matches
   - Check dashboard for error details

2. **Alipay Not Working**
   - Verify App ID and keys
   - Check gateway URL is correct
   - Ensure IP is whitelisted in Alipay console

3. **Payment Not Recorded**
   - Check backend API is running
   - Verify database connection
   - Check API logs for errors

### Debug Mode

Enable debug logging:

```typescript
// In .env.local
DEBUG=stripe:*
NODE_ENV=development
```

## Production Checklist

- [ ] Switch to production API keys
- [ ] Enable all webhooks
- [ ] Setup proper error monitoring
- [ ] Implement proper logging
- [ ] Test all payment methods
- [ ] Setup billing alerts
- [ ] Configure backup payment methods
- [ ] Review and test refund process
- [ ] Setup email notifications for payments
- [ ] Ensure SSL certificates are valid

## Support

For issues or questions:
- Stripe: [https://stripe.com/docs](https://stripe.com/docs)
- Alipay: [https://global.alipay.com/docs](https://global.alipay.com/docs)
- Internal: Check `/payment-history` for transaction details

## License

This payment system is part of the Voyager platform. See main LICENSE file for details.
