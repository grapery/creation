"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    User,
    CreditCard,
    Palette,
    Bell,
    Languages,
    Shield,
    HelpCircle,
    FileText,
    Lock,
    MessageSquare,
    Gift,
    BarChart3,
} from "lucide-react";
import { useTranslation } from "@/providers/language-provider";

const sidebarNavConfig = [
    { titleKey: "settings_nav.profile", href: "/settings/profile", icon: User },
    { titleKey: "settings_nav.membership", href: "/settings/membership", icon: CreditCard },
    { titleKey: "settings_nav.appearance", href: "/settings/appearance", icon: Palette },
    { titleKey: "settings_nav.notifications", href: "/settings/notifications", icon: Bell },
    { titleKey: "settings_nav.language", href: "/settings/language", icon: Languages },
    { titleKey: "settings_nav.genre_preferences", href: "/settings/preferences", icon: Palette },
    { titleKey: "settings_nav.privacy_safety", href: "/settings/privacy", icon: Shield },
    { titleKey: "settings_nav.blocked_users", href: "/settings/blocked", icon: Shield },
    { titleKey: "settings_nav.security", href: "/settings/security", icon: Lock },
    { titleKey: "settings_nav.token_usage", href: "/settings/usage", icon: BarChart3 },
    { titleKey: "settings_nav.creator_analytics", href: "/settings/analytics", icon: BarChart3 },
    { titleKey: "settings_nav.invite_friends", href: "/settings/referrals", icon: Gift },
    { titleKey: "settings_nav.feedback", href: "/settings/feedback", icon: MessageSquare },
    { titleKey: "settings_nav.terms_of_service", href: "/settings/terms", icon: FileText },
    { titleKey: "settings_nav.about", href: "/settings/about", icon: HelpCircle },
];

export function SettingsSidebar() {
    const pathname = usePathname();
    const { t } = useTranslation();

    return (
        <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {sidebarNavConfig.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                            isActive
                                ? "bg-secondary text-foreground font-semibold"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                        {t(item.titleKey)}
                    </Link>
                )
            })}
        </nav>
    );
}
