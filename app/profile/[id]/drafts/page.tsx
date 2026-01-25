"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { profile } from "@/lib/api/profile";
import { Storyboard, User } from "@/lib/types";
import { Loader2, Sparkles, FileText, Layers, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/providers/language-provider";
import { getAuthToken } from "@/lib/api/client";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
            icon: FileText
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
            icon: Sparkles,
            exact: false
        }] : []),
    ];

    return (
        <div className="border-b bg-background sticky top-14 z-40">
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
                    )
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

    const isOwnProfile = currentUser?.id === id || (!id && currentUser?.id);
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

                // Fetch user's drafts
                const draftsData = await profile.getDrafts(1, 50);

                if (!isMounted) return;

                setDrafts(draftsData.drafts || []);
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

    const handleDeleteDraft = async (id: string) => {
        try {
            await profile.deleteDraft(id);
            setDrafts(drafts.filter((d) => d.id !== id));
        } catch (e) {
            console.error("Failed to delete draft:", e);
        }
    };

    const handleResumeDraft = (draft: Storyboard) => {
        // Navigate to editor with draft data
        router.push(`/create?draftId=${draft.id}`);
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
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => router.push("/settings/profile")}
                                    >
                                        {t("profile.edit_profile", "Edit Profile")}
                                    </Button>
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

            {/* Drafts Content */}
            <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
                <div className="space-y-4">
                    {drafts.length === 0 ? (
                        <Card>
                            <CardContent className="p-12">
                                <div className="text-center py-12 text-muted-foreground">
                                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                                    <p className="text-lg font-semibold mb-2">{t("profile.no_drafts", "No drafts yet")}</p>
                                    <p className="text-sm">
                                        {t("profile.start_creating_drafts", "Start creating and save your drafts here")}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {drafts.map((draft) => (
                                <Card key={draft.id} className="hover:shadow-md transition-shadow relative">
                                    <CardContent className="p-4">
                                        <div
                                            onClick={() => handleResumeDraft(draft)}
                                            className="cursor-pointer flex gap-4"
                                        >
                                            {/* Cover Image */}
                                            {draft.image && (
                                                <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                                                    <img
                                                        src={draft.image}
                                                        alt={draft.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                {/* Title */}
                                                <h3 className="text-base font-bold text-foreground mb-1 line-clamp-2">
                                                    {draft.title}
                                                </h3>

                                                {/* Description */}
                                                {draft.content && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                        {draft.content}
                                                    </p>
                                                )}

                                                {/* Stats */}
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span>{draft.storyboardScenes?.length || 0} scenes</span>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {draft.createdAt ? new Date(draft.createdAt * 1000).toLocaleDateString() : "Unknown date"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteDraft(draft.id);
                                            }}
                                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3 text-muted-foreground" />
                                        </button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
