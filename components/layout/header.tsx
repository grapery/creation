"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, Loader2, Crown, Search, Bell, MessageSquare, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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
                        <Link 
                            href="/groups" 
                            onClick={(e) => handleProtectedLink(e, "/groups")}
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            {t("navigation.groups")}
                        </Link>
                    </nav>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-md mx-4 hidden md:flex items-center gap-4">
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1 text-sm font-medium">
                        <Info className="h-4 w-4" />
                        {t("navigation.about")}
                    </Link>
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search stories, people, groups..."
                            className="w-full bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary pl-9 h-9"
                        />
                    </div>
                    <nav className="flex items-center space-x-4 text-sm font-medium">
                        <Link 
                            href="/notifications" 
                            onClick={(e) => handleProtectedLink(e, "/notifications")}
                            className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
                        >
                            <Bell className="h-4 w-4" />
                            {t("navigation.notify")}
                        </Link>
                        <Link 
                            href="/chat" 
                            onClick={(e) => handleProtectedLink(e, "/chat")}
                            className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
                        >
                            <MessageSquare className="h-4 w-4" />
                            {t("navigation.messages")}
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
                                <Button variant="outline" size="sm" className="hidden md:flex border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-500 text-yellow-600 dark:text-yellow-500" asChild>
                                    <Link href="/vip">
                                        <Crown className="w-3.5 h-3.5 fill-current" /> Get Pro
                                    </Link>
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/profile">
                                    <Avatar className="h-5 w-5 mr-2">
                                        <AvatarImage src={user.avatar} alt={user.displayName || user.username} />
                                        <AvatarFallback><UserCircle className="h-5 w-5" /></AvatarFallback>
                                    </Avatar>
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
            {/* Login Prompt Modal */}
            <LoginPromptModal />
        </header>
    );
}
