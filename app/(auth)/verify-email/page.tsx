"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/api/auth";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { errorMessage } from "@/lib/utils";

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromQuery = searchParams.get("email") || "";

    const [email, setEmail] = useState(emailFromQuery);
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [error, setError] = useState("");
    const [sentOnce, setSentOnce] = useState(false);
    const [success, setSuccess] = useState(false);
    const { refreshUser } = useAuth();

    async function handleSendCode(e: React.FormEvent) {
        e.preventDefault();
        setIsSendingCode(true);
        setError("");

        try {
            await auth.sendEmailVerificationCode(email);
            setSentOnce(true);
        } catch (err: unknown) {
            setError(errorMessage(err) || "Failed to send verification code. Please try again.");
        } finally {
            setIsSendingCode(false);
        }
    }

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await auth.verifyEmail(email, code);
            setSuccess(true);

            // Refresh user data to get updated emailVerified status
            await refreshUser();

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (err: unknown) {
            setError(errorMessage(err) || "Verification failed. Please check your code and try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex h-screen items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                {success ? (
                    <Card className="border-0 shadow-none bg-transparent">
                        <CardContent className="pt-8 pb-8">
                            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                                <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tight">Email Verified!</h2>
                                    <p className="text-muted-foreground">
                                        Your email has been successfully verified. Redirecting to your dashboard...
                                    </p>
                                </div>
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-0 shadow-none bg-transparent">
                        <CardHeader className="px-0 pb-6">
                            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                            <CardDescription>
                                Enter the 6-digit verification code sent to{" "}
                                <span className="font-medium text-foreground">{email}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                            <form onSubmit={handleVerify} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            disabled={isLoading || isSendingCode}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="code" className="text-sm font-medium">
                                        Verification Code
                                    </label>
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="123456"
                                        maxLength={6}
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        autoCapitalize="none"
                                        autoComplete="one-time-code"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                                        className="text-center text-2xl tracking-widest"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Enter the 6-digit code from your email
                                    </p>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleSendCode}
                                    disabled={isSendingCode || isLoading || !email}
                                >
                                    {isSendingCode && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {sentOnce ? "Resend Code" : "Send Code"}
                                </Button>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading || code.length !== 6}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Verify Email
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm">
                                <p className="text-muted-foreground">
                                    Didn&apos;t receive a code?{" "}
                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        disabled={isSendingCode || isLoading || !email}
                                        className="text-primary hover:underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Resend
                                    </button>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
