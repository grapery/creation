"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { groups } from "@/lib/api/groups";
import { BranchGroup } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Users, BookOpen, Settings, LayoutDashboard, Share2, MoreHorizontal, Book } from "lucide-react";
import { useTranslation } from "@/providers/language-provider";

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

    const handleFollow = async () => {
        if (!group) return;
        try {
            if (isFollowing) {
                await groups.unfollow(group.id);
            } else {
                await groups.follow(group.id);
            }
            setIsFollowing(!isFollowing);
        } catch (e) {
            console.error("Failed to follow/unfollow:", e);
        }
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

    const memberCount = group.members ?? group.memberCount ?? 0;
    const storyCount = group.stories ?? group.storyCount ?? 0;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            {/* Immersive Header Banner */}
            <div className="relative h-[200px] md:h-[240px]">
                {group.avatar || group.displayImage ? (
                    <>
                        <img
                            src={group.avatar || group.displayImage}
                            alt={group.name}
                            className="w-full h-full object-cover blur-md scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/5" />
                )}
            </div>

            <div className="container max-w-6xl mx-auto px-4 pb-4">
                {/* Header Content */}
                <div className="relative -mt-16 mb-6 flex flex-col md:flex-row items-end md:items-start gap-6">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-xl bg-background p-1 shadow-xl">
                        <div className="w-full h-full rounded-lg bg-secondary overflow-hidden">
                            {group.avatar || group.displayImage ? (
                                <img
                                    src={group.avatar || group.displayImage}
                                    alt={group.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Users className="w-12 h-12 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-4 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2 drop-shadow-md md:drop-shadow-none text-white md:text-foreground">
                                    {group.name}
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                                    {group.isPublic !== undefined && (
                                        <span className="bg-secondary px-2.5 py-0.5 rounded-full text-xs font-medium text-foreground">
                                            {group.isPublic ? t("group_detail.public") : t("group_detail.private")}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{memberCount} {t("group_detail.members")}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Book className="w-4 h-4" />
                                        <span>{storyCount} {t("group_detail.stories")}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    size="sm"
                                    variant={isFollowing ? "default" : "outline"}
                                    onClick={handleFollow}
                                    className="min-w-[100px]"
                                >
                                    {isFollowing ? t("group_detail.following") : t("group_detail.follow")}
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    {t("group_detail.share")}
                                </Button>
                                <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {group.description && (
                            <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed line-clamp-2 text-left">
                                {group.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <SimpleTabs group={group} currentPath={pathname} />

            <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
