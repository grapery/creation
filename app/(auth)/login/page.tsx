"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, BookOpen } from "lucide-react";
import { AuthTopBar, OAuthProviderButton, Language, LanguageSelector, OAuthProvider } from "@/components/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login } = useAuth();
    const { t } = useTranslation();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [oauthLoading, setOAuthLoading] = useState<OAuthProvider | null>(null);
    const [oauthError, setOAuthError] = useState("");
    const [showEmailLogin, setShowEmailLogin] = useState(false);

    async function handleEmailLogin(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleOAuthLogin(provider: OAuthProvider) {
        // Placeholder for OAuth integration
        // Actual implementation would use Google/Apple Sign In SDK
        setOAuthLoading(provider);
        setOAuthError("OAuth integration coming soon");
        setTimeout(() => {
            setOAuthLoading(null);
            setTimeout(() => setOAuthError(""), 5000);
        }, 1000);
    }

    return (
        <div className="w-full max-w-sm">
            {/* Auth Top Bar with Language Selector */}
            <div className="flex justify-end mb-4">
                <LanguageSelector />
            </div>

            {/* App Icon and Title */}
            <div className="mb-8 flex flex-col items-center space-y-4">
                <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                    <BookOpen className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Voyager</h1>
                <p className="text-muted-foreground text-center">
                    Create, explore, and share interactive stories with world
                </p>
            </div>

            {/* OAuth Provider Buttons */}
            <Card className="border-0 shadow-none bg-transparent space-y-3">
                <OAuthProviderButton
                    provider="google"
                    title="Sign in with Google"
                    isLoading={oauthLoading === "google"}
                    disabled={oauthLoading !== null}
                    onClick={() => handleOAuthLogin("google")}
                />

                <OAuthProviderButton
                    provider="apple"
                    title="Sign in with Apple"
                    isLoading={oauthLoading === "apple"}
                    disabled={oauthLoading !== null}
                    onClick={() => handleOAuthLogin("apple")}
                />

                <OAuthProviderButton
                    provider="wechat"
                    title="Sign in with WeChat"
                    isLoading={oauthLoading === "wechat"}
                    disabled={oauthLoading !== null}
                    onClick={() => handleOAuthLogin("wechat")}
                />

                {oauthError && (
                    <div className="text-center text-sm text-destructive">
                        {oauthError}
                    </div>
                )}

                {/* Divider */}
                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <span className="relative flex justify-center text-xs uppercase">
                        <span className="bg-muted px-2 text-muted-foreground">
                            or
                        </span>
                    </span>
                </div>

                {/* Email Login Button */}
                <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={() => setShowEmailLogin(true)}
                >
                    Use email to sign in
                </Button>
            </Card>

            {/* Browse as Guest Button */}
            <div className="mt-4">
                <Button
                    variant="outline"
                    className="w-full"
                    asChild
                >
                    <Link href="/">
                        {t('auth.browse_as_guest')}
                    </Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                    {t('auth.browse_as_guest_description')}
                </p>
            </div>

            {/* Email Login Form (Modal-like overlay) */}
            {showEmailLogin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-sm">
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="text-lg font-semibold">Sign In</h2>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setShowEmailLogin(false);
                                    setEmail("");
                                    setPassword("");
                                    setError("");
                                }}
                            >
                                ✕
                            </Button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-medium">
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••••"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="button"
                                onClick={handleEmailLogin}
                                className="w-full"
                                disabled={isLoading || !email || !password}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                    Sign up
                </Link>
            </div>

            {/* Terms and Privacy */}
            <div className="mt-6 text-center text-xs text-muted-foreground space-y-1">
                <p>
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                    </Link>
                    {" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}
