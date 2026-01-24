"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { groups } from "@/lib/api/groups";
import { BranchGroup } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Users, BookOpen, Settings, LayoutDashboard } from "lucide-react";

// Inline Tabs for now if not installed
function SimpleTabs({ group, currentPath }: { group: BranchGroup, currentPath: string }) {
    const tabs = [
        { label: "Dashboard", href: `/groups/${group.id}`, icon: LayoutDashboard, exact: true },
        { label: "Stories", href: `/groups/${group.id}/stories`, icon: BookOpen },
        { label: "Members", href: `/groups/${group.id}/members`, icon: Users },
        { label: "Settings", href: `/groups/${group.id}/settings`, icon: Settings }, // Only if admin?
    ];

    return (
        <div className="border-b bg-background sticky top-14 z-40">
            <div className="container px-4 md:px-6 flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                    const isActive = tab.exact
                        ? currentPath === tab.href
                        : currentPath.startsWith(tab.href);

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                isActive
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default function GroupLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { id } = useParams();
    const pathname = usePathname();
    const [group, setGroup] = useState<BranchGroup | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        async function load() {
            try {
                const data = await groups.get(id as string);
                setGroup(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        </div>
    );

    if (!group) return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center">
                Group not found
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            {/* Group Header */}
            <div className="bg-card border-b pt-8 pb-4">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-3xl font-bold text-primary overflow-hidden border-4 border-background shadow-sm">
                            {group.avatar ? (
                                <img src={group.avatar} className="w-full h-full object-cover" />
                            ) : (
                                group.name[0]?.toUpperCase()
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <h1 className="text-2xl md:text-3xl font-bold">{group.name}</h1>
                            <p className="text-muted-foreground max-w-2xl">{group.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{group.memberCount || 0} Members</span>
                                <span>•</span>
                                <span>{group.storyCount || 0} Stories</span>
                                <span>•</span>
                                <span>{group.isPublic ? "Public" : "Private"}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button>Join Group</Button>
                            {/* Only show if member/admin */}
                            {/* <Button variant="outline">Invite</Button> */}
                        </div>
                    </div>
                </div>
            </div>

            <SimpleTabs group={group} currentPath={pathname} />

            <main className="flex-1 container px-4 py-8 md:px-6">
                {children}
            </main>
        </div>
    );
}
