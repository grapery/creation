"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { profile } from "@/lib/api/profile";
import { Story, User } from "@/lib/types";
import { Loader2, BookOpen, Layers, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/language-provider";
import { getAuthToken } from "@/lib/api/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ProfileHeader from "@/components/profile/profile-header-v2";
import ContentGrid from "@/components/profile/content-grid";
import "@/components/story/story-card-v2";
import ListItem from "@/components/profile/list-item";

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

export default function ProfileStoriesPage() {
    const { user: currentUser } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslation();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    const isOwnProfile = !!currentUser?.id && currentUser.id === id;
    const userId = id || currentUser?.id;

    useEffect(() => {
        if (!userId) return;

        let isMounted = true;

        async function load() {
            setLoading(true);
            try {
                // Fetch user profile
                const token = getAuthToken();
                const headers: Record<string, string> = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const userResponse = await fetch(`/api/users/${userId}`, {
                    headers,
                });
                const userData = await userResponse.json();

                if (!isMounted) return;

                setProfileUser(userData.user);
                setIsFollowing(userData.isFollowing || false);

                // Fetch user's stories
                const storiesData = await profile.getStories(userId as string, 1, 50);

                if (!isMounted) return;

                setStories(storiesData.stories || []);
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
    }, [userId]);

    const handleFollow = async () => {
        if (!profileUser) return;
        try {
            if (isFollowing) {
                await profile.unfollowUser(profileUser.id);
            } else {
                await profile.followUser(profileUser.id);
            }
            setIsFollowing(!isFollowing);
        } catch (e) {
            console.error("Failed to follow/unfollow:", e);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-foreground">{t("profile.user_not_found", "User Not Found")}</h1>
                    <Button onClick={() => router.back()}>{t("common.go_back", "Go Back")}</Button>
                </div>
            </div>
        );
    }

    const totalLikes = profileUser.totalLikes || 0;

    return (
        <div className="flex flex-col">
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
                onMessage={() => router.push(`/chat/new?peerUserId=${profileUser.id}`)}
            />

            {/* Tabs Navigation */}
            <ProfileTabs currentPath={pathname} userId={userId as string} isOwnProfile={!!isOwnProfile} />

            {/* Stories Content */}
            <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
                <ContentGrid
                    title="Stories"
                    icon={<BookOpen />}
                    loading={loading}
                    empty={stories.length === 0}
                    emptyMessage="No stories yet"
                    emptyIcon={<BookOpen />}
                    showTitle={false}
                    layout="list"
                >
                    {stories.map((story) => (
                        <ListItem
                            key={story.id}
                            id={story.id}
                            title={story.title}
                            description={story.description}
                            coverImage={story.coverImage}
                            coverIcon={<BookOpen className="h-8 w-8" />}
                            stats={{
                                likes: story.likeCount,
                                comments: story.commentCount,
                                views: story.viewCount,
                                createdAt: story.createdAt,
                            }}
                            author={story.author ? {
                                name: story.author.displayName || story.author.username || "Unknown",
                                avatar: story.author.avatar,
                                username: story.author.username,
                            } : undefined}
                            actions={
                                <Link href={`/stories/${story.id}`}>
                                    <Button size="sm" variant="outline">View</Button>
                                </Link>
                            }
                            onClick={() => router.push(`/stories/${story.id}`)}
                        />
                    ))}
                </ContentGrid>
            </main>
        </div>
    );
}
