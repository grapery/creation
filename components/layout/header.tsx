"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, Loader2, Crown } from "lucide-react";
import { LanguageSelector } from "@/components/auth/language-selector";
import { useTranslation } from "@/providers/language-provider";

export function Header() {
    const { user, loading, logout } = useAuth();
    const { t } = useTranslation();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4 md:px-6">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">V</div>
                    <span className="hidden font-bold sm:inline-block">Voyager</span>
                </Link>
                <div className="mr-4 hidden md:flex">
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">{t("navigation.home")}</Link>
                        <Link href="/groups" className="transition-colors hover:text-foreground/80 text-foreground/60">{t("navigation.groups")}</Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    {/* Language Selector */}
                    <LanguageSelector />
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : user ? (
                        <div className="flex items-center gap-4">
                            {!user.isVip && (
                                <Button variant="outline" size="sm" className="hidden md:flex border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-500 text-yellow-600 dark:text-yellow-500" asChild>
                                    <Link href="/vip">
                                        <Crown className="mr-2 h-4 w-4" /> Get Pro
                                    </Link>
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/profile">
                                    <UserCircle className="mr-2 h-4 w-4" />
                                    {user.displayName || user.username}
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => logout()}>
                                <LogOut className="h-4 w-4" />
                                <span className="sr-only">{t("auth.sign_out")}</span>
                            </Button>
                        </div>
                    ) : (
                        <nav className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">{t("auth.sign_in")}</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/register">{t("auth.sign_up")}</Link>
                            </Button>
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}
