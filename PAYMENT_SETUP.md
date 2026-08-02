# Payment Setup (Creation Web)

Web membership checkout uses **vippay** (`grapery/cmd/vippay`) via same-origin `/api/vippay/*` rewrites.

## Supported methods

1. **Stripe** — card checkout (`clientSecret` + Stripe.js)
2. **WeChat Pay** — Native QR (`qrCodeURL`) + status polling

Alipay is not productized on web (enum retained only for historical records).

## Environment (vippay)

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe |
| `STRIPE_CNY_USD_RATE` | Optional CNY→USD rate (default `0.14`) |
| `WECHAT_PAY_MCH_ID` / `WECHAT_PAY_APP_ID` / `WECHAT_PAY_API_V3_KEY` / `WECHAT_PAY_SERIAL_NO` / `WECHAT_PAY_PRIVATE_KEY` / `WECHAT_PAY_NOTIFY_URL` | WeChat Native Pay |

Frontend: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (optional mirror of Stripe publishable key).

## Flow

1. Client creates payment via vippay (`method: stripe | wechat`)
2. Stripe: confirm PaymentIntent; WeChat: show QR and poll `getPaymentStatus`
3. Webhooks: `/webhooks/stripe`, `/webhooks/wechat` on vippay
