"use client";

import { useEffect, useState } from 'react';
import { useWeChatOAuth } from '@/lib/hooks/use-wechat-oauth';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function WeChatCallbackPage() {
    const { handleCallback } = useWeChatOAuth();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code || !state) {
            console.error('[WeChat Callback] Missing required parameters');
            setError('No authorization code or state received. You may have cancelled the authorization.');
            setLoading(false);

            // 没有code，可能是用户取消授权
            setTimeout(() => {
                const redirectUrl = `/login${error ? '?error=' + encodeURIComponent(error) : ''}`;
                window.location.href = redirectUrl;
            }, 2000);
            return;
        }

        handleCallback(code, state)
            .then(() => {
                setLoading(false);
                // Successfully logged in, will be redirected by handleCallback
            })
            .catch((err) => {
                console.error('[WeChat Callback] Callback failed:', err);
                const errorMessage = err.message || 'WeChat login failed. Please try again.';
                setError(errorMessage);
                setLoading(false);

                // 跳转到登录页面并显示错误
                setTimeout(() => {
                    window.location.href = `/login?error=${encodeURIComponent(errorMessage)}`;
                }, 3000);
            });
    }, [handleCallback, error]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md p-8">
                <div className="text-center space-y-4">
                    {loading ? (
                        <>
                            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                            <h2 className="text-xl font-semibold">Logging in with WeChat</h2>
                            <p className="text-muted-foreground">
                                Please wait while we complete your sign in...
                            </p>
                        </>
                    ) : error ? (
                        <>
                            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                            <h2 className="text-xl font-semibold text-destructive">Login Failed</h2>
                            <p className="text-muted-foreground">{error}</p>
                            <p className="text-sm text-muted-foreground">
                                Redirecting you back to the login page...
                            </p>
                        </>
                    ) : (
                        <>
                            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                            <h2 className="text-xl font-semibold">Almost there!</h2>
                            <p className="text-muted-foreground">
                                Redirecting you to the home page...
                            </p>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
