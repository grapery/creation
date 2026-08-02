"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { bookmarks } from "@/lib/api/interactions";
import { Loader2, BookOpen, FileText, Sparkles, Layers, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/language-provider";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ProfileHeader from "@/components/profile/profile-header-v2";
import ContentGrid from "@/components/profile/content-grid";
import ListItem from "@/components/profile/list-item";
import type { User } from "@/lib/types";

function ProfileTabs({ currentPath, userId, isOwnProfile }: {
    currentPath: string;
    userId: string;
    isOwnProfile: boolean;
}) {
    const { t } = useTranslation();
    const basePath = `/profile/${userId}`;

    const tabs = [
        { label: t("profile.activity", "Activity"), href: basePath, icon: Layers, exact: true },
        { label: t("profile.stories", "Stories"), href: `${basePath}/stories`, icon: BookOpen },
        { label: t("profile.storyboards", "Storyboards"), href: `${basePath}/storyboards`, icon: FileText },
        { label: t("profile.characters", "Characters"), href: `${basePath}/characters`, icon: Sparkles },
        ...(isOwnProfile ? [
            { label: t("profile.drafts", "Drafts"), href: `${basePath}/drafts`, icon: FileText, exact: false },
            { label: t("profile.bookmarks", "Bookmarks"), href: `${basePath}/bookmarks`, icon: Bookmark, exact: false },
        ] : []),
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

export default function ProfileBookmarksPage() {
    const { user: currentUser } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslation();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [bookmarkItems, setBookmarkItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isOwnProfile = !!currentUser?.id && currentUser.id === id;
    const userId = id || currentUser?.id;

    useEffect(() => {
        if (!userId || !isOwnProfile) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        async function load() {
            setLoading(true);
            try {
                const response = await fetch(`/api/users/${userId}`);
                const userData = await response.json();
                if (!isMounted) return;
                setProfileUser(userData.user);

                const bookmarkData = await bookmarks.getMyBookmarks({ page: 1, limit: 50 });
                if (!isMounted) return;
                setBookmarkItems(bookmarkData.bookmarks || []);
            } catch (e) {
                console.error(e);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        load();

        return () => { isMounted = false; };
    }, [userId, isOwnProfile]);

    if (!isOwnProfile) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-muted-foreground">{t("profile.not_available", "Not available")}</p>
            </div>
        );
    }

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
                    <h1 className="text-2xl font-bold">{t("profile.user_not_found", "User Not Found")}</h1>
                    <Button onClick={() => router.back()}>{t("common.go_back", "Go Back")}</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <ProfileHeader
                user={profileUser}
                isOwnProfile={isOwnProfile}
                isFollowing={false}
                likesCount={profileUser.totalLikes || 0}
                onAvatarTap={() => {}}
                onEditProfile={() => router.push("/settings/profile")}
                onShare={() => {}}
                onFollow={() => {}}
                onMessage={() => router.push(`/chat/new?peerUserId=${profileUser.id}`)}
            />

            <ProfileTabs currentPath={pathname} userId={userId as string} isOwnProfile={!!isOwnProfile} />

            <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
                <ContentGrid
                    title={t("profile.bookmarks", "Bookmarks")}
                    icon={<Bookmark />}
                    loading={loading}
                    empty={bookmarkItems.length === 0}
                    emptyMessage={t("profile.no_bookmarks", "No bookmarks yet")}
                    emptyIcon={<Bookmark />}
                    showTitle={false}
                    layout="list"
                >
                    {bookmarkItems.map((bm) => (
                        <ListItem
                            key={bm.id}
                            id={bm.targetId || bm.id}
                            title={bm.title || bm.targetTitle || "Untitled"}
                            description={bm.description || bm.targetDescription}
                            coverImage={bm.coverImage || bm.targetCoverImage}
                            coverIcon={<Layers className="h-8 w-8" />}
                            stats={{ createdAt: bm.createdAt }}
                            onClick={() => {
                                const type = bm.bookmarkType || bm.type;
                                if (type === 'story') router.push(`/stories/${bm.targetId}`);
                                else if (type === 'storyboard') router.push(`/storyboards/${bm.targetId}`);
                                else if (type === 'fragment') router.push(`/fragments/${bm.targetId}`);
                            }}
                        />
                    ))}
                </ContentGrid>
            </main>
        </div>
    );
}
