"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Loader2, User, Mail, Lock, Calendar, ArrowLeft, BookOpen } from "lucide-react";
import { AuthBackground, LanguageSelector, Language, OAuthProviderButton, OAuthProvider } from "@/components/auth";

export default function RegisterPage() {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
    });
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [oauthLoading, setOAuthLoading] = useState<OAuthProvider | null>(null);
    const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    // Calculate max date (13 years ago)
    const maxDateOfBirth = new Date();
    maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - 13);

    // Format date to YYYY-MM-DD for backend
    const formatDateOfBirth = (dateStr: string): string => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const canSubmit = () => {
        return (
            formData.username &&
            formData.displayName &&
            formData.email &&
            formData.password &&
            formData.confirmPassword &&
            agreeToTerms &&
            agreeToPrivacy &&
            formData.password === formData.confirmPassword &&
            formData.dateOfBirth
        );
    };

    function handleOAuthLogin(provider: OAuthProvider) {
        // Placeholder for OAuth integration
        setOAuthLoading(provider);
        setTimeout(() => {
            setOAuthLoading(null);
        }, 1000);
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            // Calculate age
            const birthDate = new Date(formData.dateOfBirth);
            const age = maxDateOfBirth.getFullYear() - birthDate.getFullYear();
            if (age < 13) {
                setError("You must be at least 13 years old to register");
                return;
            }

            await register({
                username: formData.username,
                displayName: formData.displayName,
                email: formData.email,
                password: formData.password,
                agreeTerms: agreeToTerms && agreeToPrivacy,
                dateOfBirth: formatDateOfBirth(formData.dateOfBirth),
            });
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthBackground>
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Back Button */}
                    <div className="mb-4 flex justify-end">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>

                    {/* App Icon and Title */}
                    <div className="mb-6 flex flex-col items-center space-y-3">
                        <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                            <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Voyager</h1>
                        <p className="text-muted-foreground text-center">
                            Create your account and start creating
                        </p>
                    </div>

                    {/* OAuth Buttons */}
                    <Card className="mb-4 border-0 shadow-lg">
                        <CardContent className="p-4 space-y-3">
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
                        </CardContent>
                    </Card>

                    {/* Divider */}
                    <div className="relative py-3 mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <span className="relative flex justify-center">
                            <span className="bg-muted px-3 text-xs uppercase text-muted-foreground">
                                or sign up with email
                            </span>
                        </span>
                    </div>

                    {/* Registration Form Card */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-6 space-y-5">
                            {/* Full Name / Display Name */}
                            <div className="space-y-2">
                                <label htmlFor="displayName" className="text-sm font-medium">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="displayName"
                                        placeholder="Enter your full name"
                                        type="text"
                                        autoCapitalize="words"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        value={formData.displayName}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        placeholder="Choose a username"
                                        type="text"
                                        autoCapitalize="none"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <label htmlFor="dateOfBirth" className="text-sm font-medium">
                                    Date of Birth
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        max={maxDateOfBirth.toISOString().split("T")[0]}
                                        disabled={isLoading}
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    You must be at least 13 years old to create an account.
                                </p>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        placeholder="Create a password"
                                        type="password"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        placeholder="Confirm your password"
                                        type="password"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Terms and Privacy Checkboxes */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="agreeTerms"
                                        checked={agreeToTerms}
                                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                                        disabled={isLoading}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        required
                                    />
                                    <label
                                        htmlFor="agreeTerms"
                                        className="text-sm text-foreground leading-relaxed cursor-pointer"
                                    >
                                        I agree to the{" "}
                                        <Link href="/terms" className="text-primary hover:underline font-medium">
                                            Terms of Service
                                        </Link>
                                    </label>
                                </div>

                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="agreePrivacy"
                                        checked={agreeToPrivacy}
                                        onChange={(e) => setAgreeToPrivacy(e.target.checked)}
                                        disabled={isLoading}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        required
                                    />
                                    <label
                                        htmlFor="agreePrivacy"
                                        className="text-sm text-foreground leading-relaxed cursor-pointer"
                                    >
                                        I agree to the{" "}
                                        <Link href="/privacy" className="text-primary hover:underline font-medium">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                            </div>

                            {error && (
                                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="button"
                                onClick={onSubmit}
                                className="w-full"
                                disabled={!canSubmit() || isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </AuthBackground>
    );
}
