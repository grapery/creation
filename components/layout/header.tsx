"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, Loader2, Crown, Search, Bell, MessageSquare, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LanguageSelector } from "@/components/auth/language-selector";
import { useTranslation } from "@/providers/language-provider";
import { useLoginPrompt } from "@/components/auth/login-prompt";

export function Header() {
    const { user, loading, logout } = useAuth();
    const { t } = useTranslation();
    const { LoginPromptModal, show: showLoginPrompt } = useLoginPrompt();

    // Handle protected links - show login prompt if not authenticated
    const handleProtectedLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (!user) {
            e.preventDefault();
            showLoginPrompt();
        }
        // If user is authenticated, let the link work normally
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-6xl flex h-14 items-center px-4 md:px-6 mx-auto">
                <Link href="/about" className="mr-6 flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">V</div>
                    <span className="hidden font-bold sm:inline-block">Voyager</span>
                </Link>
                <div className="mr-4 hidden md:flex">
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">{t("navigation.home")}</Link>
                        <Link href="/plaza" className="transition-colors hover:text-foreground/80 text-foreground/60">Discover</Link>
                        <Link href="/fragments" className="transition-colors hover:text-foreground/80 text-foreground/60">Fragments</Link>
                    </nav>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-md mx-4 hidden md:flex items-center gap-4">
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1 text-sm font-medium">
                        <Info className="h-4 w-4" />
                        {t("navigation.about")}
                    </Link>
                    <Link href="/search" className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <div
                            className="w-full bg-secondary border-0 rounded-full pl-10 h-10 text-sm text-muted-foreground flex items-center cursor-pointer hover:bg-secondary/80 transition-colors"
                        >
                            Search stories, people...
                        </div>
                    </Link>
                    <nav className="flex items-center space-x-3 text-sm font-medium">
                        <Link 
                            href="/notifications" 
                            onClick={(e) => handleProtectedLink(e, "/notifications")}
                            className="transition-all hover:bg-secondary rounded-full p-2 text-foreground/70 hover:text-foreground"
                        >
                            <Bell className="h-5 w-5" />
                        </Link>
                        <Link 
                            href="/chat" 
                            onClick={(e) => handleProtectedLink(e, "/chat")}
                            className="transition-all hover:bg-secondary rounded-full p-2 text-foreground/70 hover:text-foreground"
                        >
                            <MessageSquare className="h-5 w-5" />
                        </Link>
                    </nav>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    {/* language selector and auth buttons */}
                    <LanguageSelector />
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : user ? (
                        <div className="flex items-center gap-4">
                            {!user.isVip && (
                                <Button variant="capsule" size="ios-sm" className="hidden md:flex bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-0 hover:opacity-90" asChild>
                                    <Link href="/vip">
                                        <Crown className="w-3.5 h-3.5 fill-current mr-1.5" /> Pro
                                    </Link>
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" className="rounded-full px-3" asChild>
                                <Link href="/profile">
                                    <Avatar className="h-7 w-7 mr-2 ring-2 ring-border">
                                        <AvatarImage src={user.avatar} alt={user.displayName || user.username} />
                                        <AvatarFallback><UserCircle className="h-7 w-7" /></AvatarFallback>
                                    </Avatar>
                                    <span className="hidden lg:inline">{user.displayName || user.username}</span>
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => logout()}>
                                <LogOut className="h-4 w-4" />
                                <span className="sr-only">{t("auth.sign_out")}</span>
                            </Button>
                        </div>
                    ) : (
                        <nav className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="rounded-full" asChild>
                                <Link href="/login">{t("auth.sign_in")}</Link>
                            </Button>
                            <Button variant="capsule" size="ios-sm" asChild>
                                <Link href="/register">{t("auth.sign_up")}</Link>
                            </Button>
                        </nav>
                    )}
                </div>
            </div>
            {/* Login Prompt Modal */}
            <LoginPromptModal />
        </header>
    );
}
