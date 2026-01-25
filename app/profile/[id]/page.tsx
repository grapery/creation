"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { ActivityFeed } from "@/components/profile/activity-feed";
import { ActivityHeatmap } from "@/components/profile/activity-heatmap";
import { Loader2, Sparkles, Drama, BookOpen, FileText, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { User, ActivityHeatmapData, ActivityTimeRange } from "@/lib/types";
import { cn } from "@/lib/utils";
import { profile } from "@/lib/api/profile";
import { useTranslation } from "@/providers/language-provider";
import { getAuthToken } from "@/lib/api/client";
import Link from "next/link";
import ProfileHeader from "@/components/profile/profile-header-v2";

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
            icon: Layers,
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
            icon: Sparkles
        },
        ...(isOwnProfile ? [{
            label: t("profile.drafts", "Drafts"),
            href: `${basePath}/drafts`,
            icon: FileText,
            exact: false
        }] : []),
    ];

    return (
        <div className="border-b border-border/50 bg-background sticky top-14 z-40">
            <div className="container max-w-6xl mx-auto px-4 flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                    const isActive = tab.exact
                        ? currentPath === tab.href
                        : currentPath.startsWith(tab.href) && tab.href !== basePath;

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
                    );
                })}
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

    const isOwnProfile = !!currentUser?.id && currentUser.id === id;
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

                // Check if token exists, if not and it's not own profile, we may want to fetch public profile
                const headers: Record<string, string> = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`/api/users/${userId}`, {
                    headers,
                });

                console.log('[Profile] Response status:', response.status, 'ok:', response.ok);

                if (!response.ok) {
                    // Handle 401 (Unauthorized) specifically
                    if (response.status === 401) {
                        console.log('[Profile] Unauthorized - token may be invalid or expired');
                        throw new Error('Authentication required. Please log in again.');
                    }
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
                    // Don't clear profile on 401 - just show error state
                    if (e instanceof Error && e.message.includes('Authentication')) {
                        setProfileUser(null);
                    } else {
                        setProfileUser(null);
                    }
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
            {/* Profile Header - Improved version */}
            <ProfileHeader
                user={profileUser}
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                likesCount={totalLikes}
                onAvatarTap={() => {}}
                onEditProfile={() => router.push("/settings/profile")}
                onFollow={handleFollow}
                onShare={() => {}}
                onMessage={() => router.push(`/chat/${profileUser.id}`)}
            />

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
