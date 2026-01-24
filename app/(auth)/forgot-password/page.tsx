"use client";

import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await auth.requestPasswordReset(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Failed to send reset link. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex h-screen items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md">
                <div className="mb-6">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Login
                        </Button>
                    </Link>
                </div>

                {success ? (
                    <Card className="border-0 shadow-none bg-transparent">
                        <CardContent className="pt-8 pb-8">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Mail className="h-8 w-8 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tight">Check Your Email</h2>
                                    <p className="text-muted-foreground">
                                        We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Click the link in the email to reset your password. If you don't see it, check your spam folder.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setSuccess(false);
                                        setEmail("");
                                    }}
                                >
                                    Try Another Email
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-0 shadow-none bg-transparent">
                        <CardHeader className="px-0 pb-6">
                            <CardTitle className="text-2xl">Forgot Password</CardTitle>
                            <CardDescription>
                                Enter your email address and we'll send you a link to reset your password
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                            <form onSubmit={onSubmit} className="space-y-4">
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
                                            disabled={isLoading}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-sm text-destructive">
                                        {error}
                                    </div>
                                )}

                                <Button type="submit" className="w-full" disabled={isLoading || !email}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Reset Link
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm">
                                <span className="text-muted-foreground">
                                    Remember your password?{" "}
                                    <Link href="/login" className="text-primary hover:underline underline-offset-4">
                                        Sign in
                                    </Link>
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
