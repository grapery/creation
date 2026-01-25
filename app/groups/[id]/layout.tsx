"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { groups } from "@/lib/api/groups";
import { BranchGroup } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Loader2, Users, BookOpen, Settings, LayoutDashboard } from "lucide-react";
import { useTranslation } from "@/providers/language-provider";
import { GroupDetailHeader } from "@/components/group/group-detail-header";

// Inline Tabs
function SimpleTabs({ group, currentPath }: { group: BranchGroup, currentPath: string }) {
    const { t } = useTranslation();
    const tabs = [
        { label: t("group_detail.dashboard", "Dashboard"), href: `/groups/${group.id}`, icon: LayoutDashboard, exact: true },
        { label: t("group_detail.stories", "Stories"), href: `/groups/${group.id}/stories`, icon: BookOpen },
        { label: t("group_detail.members", "Members"), href: `/groups/${group.id}/members`, icon: Users },
        { label: t("group_detail.settings", "Settings"), href: `/groups/${group.id}/settings`, icon: Settings },
    ];

    return (
        <div className="border-b bg-background sticky top-14 z-40">
            <div className="container max-w-6xl mx-auto px-4 flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                    const isActive = tab.exact
                        ? currentPath === tab.href
                        : currentPath.startsWith(tab.href) && tab.href !== `/groups/${group.id}`;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                isActive
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
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
    const { t } = useTranslation();
    const { id } = useParams();
    const pathname = usePathname();
    const [group, setGroup] = useState<BranchGroup | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const hasLoadedRef = useRef(false);

    useEffect(() => {
        if (!id || hasLoadedRef.current) return;

        let isMounted = true;

        async function load() {
            try {
                const data = await groups.get(id as string);

                if (!isMounted) return;

                setGroup(data);
                setIsFollowing(data.isFollowing || false);
                hasLoadedRef.current = true;
            } catch (e) {
                console.error(e);
                if (isMounted) {
                    setLoading(false);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleFollowChange = (newStatus: boolean) => {
        setIsFollowing(newStatus);
    };

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
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">{t("group_detail.group_not_found")}</h1>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <GroupDetailHeader
                group={group}
                isFollowing={isFollowing}
                onFollowChange={handleFollowChange}
            />

            <SimpleTabs group={group} currentPath={pathname} />

            <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
