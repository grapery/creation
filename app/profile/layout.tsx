"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, Layers, Users, Settings, User, FileEdit } from "lucide-react";

const sidebarNavItems = [
    {
        title: "Overview",
        href: "/profile",
        icon: LayoutDashboard,
        exact: true
    },
    {
        title: "My Stories",
        href: "/profile/stories",
        icon: BookOpen,
    },
    {
        title: "My Storyboards",
        href: "/profile/storyboards",
        icon: Layers,
    },
    {
        title: "Characters",
        href: "/profile/characters",
        icon: Users,
    },
    {
        title: "Settings",
        href: "/profile/settings",
        icon: Settings,
    },
    {
        title: "Drafts",
        href: "/profile/drafts",
        icon: FileEdit,
    }
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1 container px-4 md:px-6 py-6 md:grid md:grid-cols-[220px_1fr] md:gap-8">
                <aside className="mb-4 md:mb-0">
                    <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto scrollbar-hide">
                        {sidebarNavItems.map((item) => {
                            const isActive = item.exact
                                ? pathname === item.href
                                : pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                                        isActive
                                            ? "bg-secondary text-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            )
                        })}
                    </nav>
                </aside>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
