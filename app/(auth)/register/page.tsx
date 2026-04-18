"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Loader2, User, Mail, Lock, Calendar, ArrowLeft, BookOpen } from "lucide-react";
import { AuthBackground, LanguageSelector, OAuthProviderButton, OAuthProvider } from "@/components/auth";
import { useGoogleOAuth } from "@/lib/hooks/use-google-oauth";
import { useWeChatOAuth } from "@/lib/hooks/use-wechat-oauth";
import { auth } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const { register } = useAuth();
    const { t } = useTranslation();
    const router = useRouter();
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
    const [oauthError, setOAuthError] = useState("");

    const { isLoaded: googleLoaded, signIn: googleSignIn } = useGoogleOAuth({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        onSuccess: async (credentialResponse) => {
            try {
                await auth.loginWithGoogle({ idToken: credentialResponse.credential });
                router.push('/');
            } catch (err: any) {
                setOAuthError(err.message || 'Google sign-in failed');
            } finally {
                setOAuthLoading(null);
            }
        },
        onError: () => {
            setOAuthError('Google sign-in failed');
            setOAuthLoading(null);
        },
    });

    const { signIn: weChatSignIn } = useWeChatOAuth();

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
        setOAuthLoading(provider);
        setOAuthError("");

        if (provider === "google") {
            if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
                setOAuthError("Google OAuth is not configured.");
                setOAuthLoading(null);
                return;
            }
            try {
                googleSignIn();
            } catch (e: any) {
                setOAuthError(e.message || "Failed to initiate Google sign-in.");
                setOAuthLoading(null);
            }
        } else if (provider === "apple") {
            setOAuthError("Apple Sign In coming soon");
            setOAuthLoading(null);
        } else if (provider === "wechat") {
            try {
                weChatSignIn();
            } catch (e: any) {
                setOAuthError(e.message || "Failed to initiate WeChat sign-in.");
                setOAuthLoading(null);
            }
        }
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

            try {
                if (formData.password !== formData.confirmPassword) {
                    setError(t('auth.passwords_do_not_match_error'));
                    return;
                }

                // Calculate age
                const birthDate = new Date(formData.dateOfBirth);
                const age = maxDateOfBirth.getFullYear() - birthDate.getFullYear();
                if (age < 13) {
                    setError(t('auth.age_requirement_error'));
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
            setError(err.message || t('auth.register_failed'));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthBackground>
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    {/* Back Button */}
                    <div className="mb-4 flex justify-end">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                {t('auth.back_to_sign_in')}
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
                            {t('auth.register_tagline')}
                        </p>
                    </div>

                    {/* OAuth Buttons */}
                    <Card className="mb-4 border-0 shadow-lg">
                        <CardContent className="p-4 space-y-3">
                            <OAuthProviderButton
                                provider="google"
                                title={t('auth.sign_in_with_google')}
                                isLoading={oauthLoading === "google"}
                                disabled={oauthLoading !== null}
                                onClick={() => handleOAuthLogin("google")}
                            />

                            <OAuthProviderButton
                                provider="apple"
                                title={t('auth.sign_in_with_apple')}
                                isLoading={oauthLoading === "apple"}
                                disabled={oauthLoading !== null}
                                onClick={() => handleOAuthLogin("apple")}
                            />

                            {oauthError && (
                                <div className="text-center text-sm text-destructive">{oauthError}</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Divider */}
                    <div className="relative py-3 mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <span className="relative flex justify-center">
                            <span className="bg-muted px-3 text-xs uppercase text-muted-foreground">
                                {t('auth.or_sign_up_with_email')}
                            </span>
                        </span>
                    </div>

                    {/* Registration Form Card */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-8 space-y-6">
                            {/* Two Column Layout for Display Name and Username */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name / Display Name */}
                                <div className="space-y-2">
                                    <label htmlFor="displayName" className="text-sm font-medium">
                                        {t('auth.full_name')}
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="displayName"
                                            placeholder={t('auth.full_name_placeholder')}
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
                                        {t('profile.username')}
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="username"
                                            placeholder={t('auth.username_placeholder')}
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
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    {t('auth.email')}
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        placeholder={t('auth.email_placeholder')}
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
                                    {t('auth.date_of_birth')}
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
                                    {t('auth.age_requirement_notice')}
                                </p>
                            </div>

                            {/* Two Column Layout for Password Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Password */}
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium">
                                        {t('auth.password')}
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            placeholder={t('auth.create_password_placeholder')}
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
                                        {t('auth.confirm_password')}
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            placeholder={t('auth.confirm_password_placeholder')}
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
                                        {t('auth.i_agree_to_the')}{" "}
                                        <Link href="/terms" className="text-primary hover:underline font-medium">
                                            {t('auth.terms_of_service')}
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
                                        {t('auth.i_agree_to_the')}{" "}
                                        <Link href="/privacy" className="text-primary hover:underline font-medium">
                                            {t('auth.privacy_policy')}
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
                                {t('auth.create_account_button')}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            {t('auth.already_have_account')}{" "}
                            <Link href="/login" className="font-medium text-primary hover:underline">
                                {t('auth.sign_in')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </AuthBackground>
    );
}
