"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { ActivityFeed } from "@/components/profile/activity-feed";
import { ActivityHeatmap } from "@/components/profile/activity-heatmap";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Drama, BookOpen, FileText, LayoutDashboard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { User, ActivityHeatmapData, ActivityTimeRange, Storyboard, Story } from "@/lib/types";
import { cn } from "@/lib/utils";
import { profile } from "@/lib/api/profile";
import { useTranslation } from "@/providers/language-provider";
import { getAuthToken } from "@/lib/api/client";
import Link from "next/link";

enum ProfileTab {
    ACTIVITY = "activity",
    STORIES = "stories",
    STORYBOARDS = "storyboards",
    CHARACTERS = "characters",
    DRAFTS = "drafts",
}

// Inline Tabs component
function ProfileTabs({
    currentPath,
    userId,
    isOwnProfile
}: {
    currentPath: string;
    userId: string;
    isOwnProfile: boolean;
}) {
    const { t } = useTranslation();
    const basePath = `/profile/${userId}`;

    const tabs = [
        {
            label: t("profile.activity", "Activity"),
            href: basePath,
            icon: LayoutDashboard,
            exact: true
        },
        {
            label: t("profile.stories", "Stories"),
            href: `${basePath}/stories`,
            icon: BookOpen
        },
        {
            label: t("profile.storyboards", "Storyboards"),
            href: `${basePath}/storyboards`,
            icon: FileText
        },
        {
            label: t("profile.characters", "Characters"),
            href: `${basePath}/characters`,
            icon: Drama
        },
        ...(isOwnProfile ? [{
            label: t("profile.drafts", "Drafts"),
            href: `${basePath}/drafts`,
            icon: Sparkles,
            exact: false
        }] : []),
    ];

    return (
        <div className="bg-background sticky top-14 z-40 border-b border-border/50">
            <div className="container max-w-6xl mx-auto px-4 py-2 flex overflow-x-auto scrollbar-hide">
                <div className="flex items-center space-x-2">
                    {tabs.map((tab) => {
                        const isActive = tab.exact
                            ? currentPath === tab.href
                            : currentPath.startsWith(tab.href) && tab.href !== basePath;

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                                    isActive
                                        ? "text-primary font-bold bg-secondary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const { user: currentUser } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslation();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    const isOwnProfile = currentUser?.id === id || (!id && currentUser?.id);
    const userId = id || currentUser?.id;

    const hasLoadedRef = useRef(false);

    useEffect(() => {
        if (!userId || hasLoadedRef.current) return;

        let isMounted = true;

        async function fetchProfile() {
            setLoading(true);
            try {
                console.log('[Profile] Fetching user profile for userId:', userId);
                const token = getAuthToken();
                console.log('[Profile] Token exists:', !!token, 'Token length:', token?.length);

                const headers: Record<string, string> = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`/api/users/${userId}`, {
                    headers,
                });

                console.log('[Profile] Response status:', response.status, 'ok:', response.ok);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('[Profile] Response data:', data);

                if (!isMounted) return;

                setProfileUser(data.user);
                setIsFollowing(data.isFollowing || false);
                hasLoadedRef.current = true;
            } catch (e) {
                console.error("Failed to fetch profile:", e);
                if (isMounted) {
                    setProfileUser(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, [userId]);

    const handleFollow = async () => {
        if (!profileUser) return;
        try {
            const token = getAuthToken();
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            if (isFollowing) {
                await fetch(`/api/users/${profileUser.id}/follow`, {
                    method: 'DELETE',
                    headers,
                });
            } else {
                await fetch(`/api/users/${profileUser.id}/follow`, {
                    method: 'POST',
                    headers,
                });
            }
            setIsFollowing(!isFollowing);
        } catch (e) {
            console.error("Failed to follow/unfollow:", e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">{t("profile.user_not_found", "User Not Found")}</h1>
                    <Button onClick={() => router.back()}>{t("common.go_back", "Go Back")}</Button>
                </div>
            </div>
        );
    }

    const totalLikes = profileUser.totalLikes || 0;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Immersive Header */}
            <div className="h-[200px] w-full relative">
                {profileUser.background ? (
                    <>
                        <img
                            src={profileUser.background}
                            alt="Cover"
                            className="w-full h-full object-cover blur-md"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </>
                ) : profileUser.avatar ? (
                    <>
                        <img
                            src={profileUser.avatar}
                            alt="Cover"
                            className="w-full h-full object-cover blur-md"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/80 via-primary/60 to-background" />
                )}
            </div>

            <div className="container max-w-6xl mx-auto px-4 pb-4">
                {/* Profile Info Section */}
                <div className="relative -mt-16 mb-6">
                    <div className="flex flex-col md:flex-row items-end md:items-start gap-6">
                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-xl bg-background p-1 shadow-xl">
                            <div className="w-full h-full rounded-lg bg-secondary overflow-hidden">
                                {profileUser.avatar ? (
                                    <img
                                        src={profileUser.avatar}
                                        alt={profileUser.displayName || profileUser.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-4xl font-bold text-muted-foreground">
                                            {(profileUser.displayName || profileUser.username)?.[0]?.toUpperCase() || "?"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 pt-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-3xl font-bold text-foreground">
                                            {profileUser.displayName || profileUser.username}
                                        </h1>
                                        {profileUser.isVip && (
                                            <span className="text-orange-500 text-2xl">👑</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                        <span>@{profileUser.username}</span>
                                        {profileUser.createdAt && (
                                            <>
                                                <span>·</span>
                                                <span>{t("profile.joined", "Joined")} {new Date(profileUser.createdAt * 1000).toLocaleDateString("en-US", { year: "numeric", month: "2-digit" })}</span>
                                            </>
                                        )}
                                    </div>
                                    {profileUser.bio && (
                                        <p className="mt-3 text-muted-foreground max-w-2xl">
                                            {profileUser.bio}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    {isOwnProfile ? (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.push("/settings/profile")}
                                            >
                                                {t("profile.edit_profile", "Edit Profile")}
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant={isFollowing ? "outline" : "default"}
                                            onClick={handleFollow}
                                        >
                                            {isFollowing ? t("profile.following", "Following") : t("profile.follow", "Follow")}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 mt-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-foreground">{profileUser.followingCount || 0}</span>
                                    <span className="text-muted-foreground">{t("profile.following", "following")}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-foreground">{profileUser.followerCount || 0}</span>
                                    <span className="text-muted-foreground">{t("profile.followers", "followers")}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-semibold text-foreground">{totalLikes}</span>
                                    <span className="text-muted-foreground">{t("profile.likes", "likes")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <ProfileTabs currentPath={pathname} userId={userId as string} isOwnProfile={!!isOwnProfile} />

            {/* Activity Tab Content (default) */}
            <ActivityTabContent userId={userId as string} />
        </div>
    );
}

// Activity Tab Content
function ActivityTabContent({ userId }: { userId: string }) {
    const [heatmapData, setHeatmapData] = useState<ActivityHeatmapData[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedTimeRange, setSelectedTimeRange] = useState<ActivityTimeRange>(ActivityTimeRange.MONTH);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [loadingHeatmap, setLoadingHeatmap] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchHeatmap() {
            setLoadingHeatmap(true);
            try {
                const response = await profile.getHeatmap(userId, selectedTimeRange);
                if (!isMounted) return;

                setHeatmapData(response.data || []);
                setTotalCount(response.totalCount || 0);
            } catch (e) {
                console.error('Failed to fetch heatmap:', e);
                if (isMounted) {
                    setHeatmapData([]);
                    setTotalCount(0);
                }
            } finally {
                if (isMounted) {
                    setLoadingHeatmap(false);
                }
            }
        }

        fetchHeatmap();

        return () => {
            isMounted = false;
        };
    }, [userId, selectedTimeRange]);

    return (
        <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
            <div className="space-y-4">
                {/* Heatmap Card */}
                <Card>
                    <CardContent className="p-4">
                        <ActivityHeatmap
                            data={heatmapData}
                            totalCount={totalCount}
                            selectedTimeRange={selectedTimeRange}
                            selectedDate={selectedDate}
                            isLoading={loadingHeatmap}
                            onTimeRangeChange={setSelectedTimeRange}
                            onDateSelect={setSelectedDate}
                        />
                    </CardContent>
                </Card>

                {/* Activity List */}
                <Card>
                    <CardContent className="p-4">
                        <ActivityFeed userId={userId} />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
