"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { profile } from "@/lib/api/profile";
import { Storyboard, User } from "@/lib/types";
import { Loader2, BookOpen, FileText, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/language-provider";
import { getAuthToken } from "@/lib/api/client";
import { showConfirm, showSuccess, showError } from "@/lib/toast-utils";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ProfileHeader from "@/components/profile/profile-header-v2";
import ContentGrid from "@/components/profile/content-grid";
import "@/components/storyboard/storyboard-card-v2";
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

export default function ProfileDraftsPage() {
    const { user: currentUser } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslation();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [drafts, setDrafts] = useState<Storyboard[]>([]);
    const [loading, setLoading] = useState(true);

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

                // Fetch user's drafts (dashboard storyboards with draft status)
                const draftsData = await profile.getDrafts(1, 50);

                if (!isMounted) return;

                // Filter for draft status if backend returns all statuses
                const allStoryboards = (draftsData.storyboards || []) as (Storyboard & { status?: string; publishedAt?: number })[];
                const draftItems = allStoryboards.filter(
                    (sb) => sb.status === 'draft' || sb.publishedAt === 0 || !sb.publishedAt
                );
                setDrafts(draftItems.length > 0 ? draftItems : allStoryboards);
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

    const handleDelete = async (draftId: string) => {
        const confirmed = await showConfirm(
            t("profile.confirm_delete", "Are you sure you want to delete this draft?"),
            {
                confirmText: t("common.delete", "Delete"),
                cancelText: t("common.cancel", "Cancel"),
            }
        );
        
        if (!confirmed) return;

        try {
            await profile.deleteDraft(draftId);

            // Remove from local state
            setDrafts(drafts.filter(draft => draft.id !== draftId));
            showSuccess(t("profile.draft_deleted", "Draft deleted successfully"));
        } catch (e) {
            console.error("Failed to delete draft:", e);
            showError(t("profile.delete_failed", "Failed to delete draft"));
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
                    <h1 className="text-2xl font-bold">{t("profile.user_not_found", "User Not Found")}</h1>
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
                isFollowing={false}
                likesCount={totalLikes}
                onAvatarTap={() => {}}
                onEditProfile={() => router.push("/settings/profile")}
                onShare={() => {}}
                onFollow={() => {}}
                onMessage={() => router.push(`/chat/new?peerUserId=${profileUser.id}`)}
            />

            {/* Tabs Navigation */}
            <ProfileTabs currentPath={pathname} userId={userId as string} isOwnProfile={!!isOwnProfile} />

            {/* Drafts Content */}
            <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
                <ContentGrid
                    title="Drafts"
                    icon={<FileText />}
                    loading={loading}
                    empty={drafts.length === 0}
                    emptyMessage="No drafts yet"
                    emptyIcon={<FileText />}
                    showTitle={false}
                    layout="list"
                >
                    {drafts.map((draft) => (
                        <div key={draft.id} className="relative group">
                            <ListItem
                                id={draft.id}
                                title={draft.title}
                                description={draft.content}
                                coverImage={draft.image}
                                coverIcon={<Layers className="h-8 w-8" />}
                                stats={{
                                    scenes: draft.sceneCount,
                                    createdAt: draft.createdAt,
                                }}
                                author={draft.creatorName ? {
                                    name: draft.creatorName,
                                    avatar: draft.creatorAvatar,
                                    username: undefined,
                                } : undefined}
                                actions={
                                    <>
                                        <Link href={`/storyboards/${draft.id}/editor`}>
                                            <Button size="sm" variant="outline" className="mr-2">Edit</Button>
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(draft.id);
                                            }}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            Delete
                                        </Button>
                                    </>
                                }
                                onClick={() => router.push(`/storyboards/${draft.id}/editor`)}
                            />
                        </div>
                    ))}
                </ContentGrid>
            </main>
        </div>
    );
}
