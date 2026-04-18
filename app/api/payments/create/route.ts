import { NextRequest, NextResponse } from 'next/server';
import { PaymentMethod, PaymentResponse, PaymentStatus } from '@/lib/types/payment';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8080';

export async function POST(req: NextRequest) {
    try {
        // Verify authentication
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { planId, method, currency = 'USD', savePaymentMethod = false } = body;

        if (!planId || !method) {
            return NextResponse.json(
                { error: 'Missing required fields: planId and method' },
                { status: 400 }
            );
        }

        // Validate payment method
        const validMethods = Object.values(PaymentMethod);
        if (!validMethods.includes(method)) {
            return NextResponse.json(
                { error: 'Invalid payment method' },
                { status: 400 }
            );
        }

        // Get plan details
        const planDetails = await getPlanDetails(planId);
        if (!planDetails) {
            return NextResponse.json(
                { error: 'Plan not found' },
                { status: 404 }
            );
        }

        // Extract userId from JWT token
        const userId = extractUserIdFromToken(authHeader);
        if (!userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        switch (method) {
            case PaymentMethod.STRIPE:
                return await handleStripePayment(userId, planId, planDetails, currency);
            case PaymentMethod.ALIPAY:
                return await handleAlipayPayment(userId, planId, planDetails);
            case PaymentMethod.GOOGLE_PAY:
                return await handleGooglePayPayment(userId, planId, planDetails);
            case PaymentMethod.APPLE_PAY:
                return await handleApplePayPayment(userId, planId, planDetails);
            default:
                return NextResponse.json(
                    { error: 'Payment method not implemented' },
                    { status: 501 }
                );
        }
    } catch (error: any) {
        console.error('[API /api/payments/create] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

async function getPlanDetails(planId: string) {
    // Import VIP plans
    const { MEMBERSHIP_PLANS } = await import('@/lib/api/vip');
    return MEMBERSHIP_PLANS.find(plan => plan.id === planId);
}

async function handleStripePayment(
    userId: string,
    planId: string,
    planDetails: any,
    currency: string
): Promise<NextResponse> {
    try {
        // Create Stripe payment intent
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const amount = planDetails.price; // Amount in cents

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: currency.toLowerCase(),
            metadata: {
                userId,
                planId,
                productName: planDetails.name.en || planDetails.name.zh,
            },
            description: `${planDetails.name.en || planDetails.name.zh} - Voyager Membership`,
        });

        // Store payment record in database
        const { createPaymentRecord } = await import('@/lib/payment/storage');
        const paymentRecord = await createPaymentRecord({
            userId,
            planId,
            amount,
            currency,
            method: PaymentMethod.STRIPE,
            status: PaymentStatus.PENDING,
            metadata: {
                productName: planDetails.name.en || planDetails.name.zh,
                productDescription: planDetails.description.en || planDetails.description.zh,
                trialDays: planDetails.trialDays,
            },
            stripePaymentIntentId: paymentIntent.id,
        });

        const response: PaymentResponse = {
            success: true,
            paymentId: paymentRecord.id,
            clientSecret: paymentIntent.client_secret,
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('[Stripe Payment] Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

async function handleAlipayPayment(
    userId: string,
    planId: string,
    planDetails: any
): Promise<NextResponse> {
    try {
        // For Alipay, we would integrate with Alipay SDK or payment gateway
        // This is a placeholder implementation
        const outTradeNo = `voyager_${Date.now()}_${userId.slice(0, 8)}`;

        // Store payment record
        const { createPaymentRecord } = await import('@/lib/payment/storage');
        const paymentRecord = await createPaymentRecord({
            userId,
            planId,
            amount: planDetails.price,
            currency: planDetails.currency || 'USD',
            method: PaymentMethod.ALIPAY,
            status: PaymentStatus.PENDING,
            metadata: {
                productName: planDetails.name.en || planDetails.name.zh,
                productDescription: planDetails.description.en || planDetails.description.zh,
            },
            alipayOutTradeNo: outTradeNo,
        });

        // In production, you would:
        // 1. Call Alipay API to create payment
        // 2. Get payment URL and QR code
        // 3. Return to frontend

        const response: PaymentResponse = {
            success: true,
            paymentId: paymentRecord.id,
            paymentUrl: `https://openapi.alipay.com/gateway.do?out_trade_no=${outTradeNo}`,
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('[Alipay Payment] Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

async function handleGooglePayPayment(
    userId: string,
    planId: string,
    planDetails: any
): Promise<NextResponse> {
    try {
        // Google Pay integration typically uses Stripe as the processor
        // The Google Pay token is processed through Stripe
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        const amount = planDetails.price;

        // Create a payment intent for Google Pay
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata: {
                userId,
                planId,
                paymentMethod: 'google_pay',
                productName: planDetails.name.en || planDetails.name.zh,
            },
            payment_method_types: ['card'],
        });

        // Store payment record
        const { createPaymentRecord } = await import('@/lib/payment/storage');
        const paymentRecord = await createPaymentRecord({
            userId,
            planId,
            amount,
            currency: 'USD',
            method: PaymentMethod.GOOGLE_PAY,
            status: PaymentStatus.PENDING,
            metadata: {
                productName: planDetails.name.en || planDetails.name.zh,
            },
            stripePaymentIntentId: paymentIntent.id,
        });

        const response: PaymentResponse = {
            success: true,
            paymentId: paymentRecord.id,
            clientSecret: paymentIntent.client_secret,
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('[Google Pay Payment] Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

async function handleApplePayPayment(
    userId: string,
    planId: string,
    planDetails: any
): Promise<NextResponse> {
    try {
        // Apple Pay integration typically uses Stripe as the processor
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        const amount = planDetails.price;

        // Create a payment intent for Apple Pay
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata: {
                userId,
                planId,
                paymentMethod: 'apple_pay',
                productName: planDetails.name.en || planDetails.name.zh,
            },
            payment_method_types: ['card'],
        });

        // Store payment record
        const { createPaymentRecord } = await import('@/lib/payment/storage');
        const paymentRecord = await createPaymentRecord({
            userId,
            planId,
            amount,
            currency: 'USD',
            method: PaymentMethod.APPLE_PAY,
            status: PaymentStatus.PENDING,
            metadata: {
                productName: planDetails.name.en || planDetails.name.zh,
            },
            stripePaymentIntentId: paymentIntent.id,
        });

        const response: PaymentResponse = {
            success: true,
            paymentId: paymentRecord.id,
            clientSecret: paymentIntent.client_secret,
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('[Apple Pay Payment] Error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

function extractUserIdFromToken(authHeader: string): string | null {
    try {
        const token = authHeader.replace('Bearer ', '');
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1]));
        return payload.sub || payload.userId || payload.id || null;
    } catch {
        return null;
    }
}
