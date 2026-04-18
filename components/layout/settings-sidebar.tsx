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

const sidebarNavItems = [
    {
        title: "Profile",
        href: "/settings/profile",
        icon: User,
    },
    {
        title: "Membership",
        href: "/settings/membership",
        icon: CreditCard,
    },
    {
        title: "Appearance",
        href: "/settings/appearance",
        icon: Palette,
    },
    {
        title: "Notifications",
        href: "/settings/notifications",
        icon: Bell,
    },
    {
        title: "Language",
        href: "/settings/language",
        icon: Languages,
    },
    {
        title: "Genre Preferences",
        href: "/settings/preferences",
        icon: Palette,
    },
    {
        title: "Privacy & Safety",
        href: "/settings/privacy",
        icon: Shield,
    },
    {
        title: "Blocked Users",
        href: "/settings/blocked",
        icon: Shield,
    },
    {
        title: "Security",
        href: "/settings/security",
        icon: Lock,
    },
    {
        title: "Token Usage",
        href: "/settings/usage",
        icon: BarChart3,
    },
    {
        title: "Creator Analytics",
        href: "/settings/analytics",
        icon: BarChart3,
    },
    {
        title: "Invite Friends",
        href: "/settings/referrals",
        icon: Gift,
    },
    {
        title: "Feedback",
        href: "/settings/feedback",
        icon: MessageSquare,
    },
    {
        title: "Terms of Service",
        href: "/settings/terms",
        icon: FileText,
    },
    {
        title: "About",
        href: "/settings/about",
        icon: HelpCircle,
    },
];

export function SettingsSidebar() {
    const pathname = usePathname();

    return (
        <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {sidebarNavItems.map((item) => {
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
                        {item.title}
                    </Link>
                )
            })}
        </nav>
    );
}
