"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { ProfileHeader, SocialProfileHeader } from "@/components/profile/profile-header";
import { ActivityFeed } from "@/components/profile/activity-feed";
import { ActivityHeatmap } from "@/components/profile/activity-heatmap";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Mask } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/lib/types";
import { cn } from "@/lib/utils";

enum ProfileTab {
    ACTIVITY = "activity",
    STORIES = "stories",
    CHARACTERS = "characters",
    DRAFTS = "drafts",
}

export default function ProfilePage() {
    const { user: currentUser } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<ProfileTab>(ProfileTab.ACTIVITY);
    const [isFollowing, setIsFollowing] = useState(false);
    const [scrollOffset, setScrollOffset] = useState(0);

    const isOwnProfile = currentUser?.id === id || (!id && currentUser?.id);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            try {
                if (id) {
                    // Fetch other user's profile
                    const response = await fetch(`/api/users/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    const data = await response.json();
                    setProfileUser(data.user);
                    setIsFollowing(data.isFollowing || false);
                } else if (currentUser) {
                    // Current user's profile
                    setProfileUser(currentUser);
                }
            } catch (e) {
                console.error("Failed to fetch profile:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [id, currentUser]);

    const handleFollow = async () => {
        if (!profileUser) return;
        try {
            if (isFollowing) {
                await fetch(`/api/users/${profileUser.id}/unfollow`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
            } else {
                await fetch(`/api/users/${profileUser.id}/follow`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
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
                    <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    const totalLikes = profileUser.totalLikes || 0;

    return (
        <div className="min-h-screen bg-background">
            {/* Immersive Header */}
            <div className="h-[160px] w-full relative">
                {profileUser.background ? (
                    <>
                        <img
                            src={profileUser.background}
                            alt="Cover"
                            className="w-full h-full object-cover blur-xl"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </>
                ) : profileUser.avatar ? (
                    <>
                        <img
                            src={profileUser.avatar}
                            alt="Cover"
                            className="w-full h-full object-cover blur-xl"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/80 via-primary/60 to-background" />
                )}
            </div>

            {/* Profile Info Section */}
            <div className="relative -top-11 px-4 z-10">
                <div className="bg-card rounded-xl border border-border p-4">
                    {/* Avatar + Actions Row */}
                    <div className="flex items-end justify-between gap-4 mb-3 -mt-11">
                        {/* Avatar */}
                        <button
                            onClick={() => {
                                // Show avatar preview
                            }}
                            className="relative w-[88px] h-[88px] rounded-full border-[4px] border-background shadow-[0_5px_4px_rgba(0,0,0,0.1)] overflow-hidden flex-shrink-0"
                        >
                            {profileUser.avatar ? (
                                <img
                                    src={profileUser.avatar}
                                    alt={profileUser.displayName || profileUser.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-background">
                                    <span className="text-4xl font-bold text-muted-foreground">
                                        {(profileUser.displayName || profileUser.username)?.[0]?.toUpperCase() || "?"}
                                    </span>
                                </div>
                            )}
                        </button>

                        <div className="flex-1" />

                        {/* Action Buttons */}
                        <div className="flex gap-2 pb-2 items-end">
                            {isOwnProfile ? (
                                <>
                                    <button
                                        className="px-4 h-8 bg-transparent text-foreground border border-border rounded-full text-sm font-medium"
                                        onClick={() => router.push("/profile/settings")}
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        className="flex items-center gap-1 px-3 h-8 bg-transparent text-foreground border border-border rounded-full text-sm font-medium"
                                    >
                                        <span>Share</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleFollow}
                                        className={`px-4 h-8 rounded-full text-sm font-medium ${
                                            isFollowing
                                                ? "bg-transparent text-foreground border border-border"
                                                : "bg-primary text-white border-transparent"
                                        }`}
                                    >
                                        {isFollowing ? "Following" : "Follow"}
                                    </button>
                                    <button
                                        className="w-8 h-8 rounded-full bg-transparent text-foreground border border-border flex items-center justify-center"
                                    >
                                        <span className="text-sm">💬</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-2">
                        {/* Name and VIP */}
                        <div className="flex items-center gap-1.5">
                            <h1 className="text-[24px] font-bold text-foreground">
                                {profileUser.displayName || profileUser.username}
                            </h1>
                            {profileUser.isVip && (
                                <span className="text-orange-500">👑</span>
                            )}
                        </div>

                        {/* Username and Joined Date */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>@{profileUser.username}</span>
                            {profileUser.createdAt && (
                                <>
                                    <span>·</span>
                                    <span>Joined {new Date(profileUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "2-digit" })}</span>
                                </>
                            )}
                        </div>

                        {/* Bio */}
                        {profileUser.bio && (
                            <p className="text-[15px] text-foreground line-clamp-3">
                                {profileUser.bio}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <span className="text-[16px] font-semibold text-foreground">
                                    {profileUser.followingCount || 0}
                                </span>
                                <span>following</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-[16px] font-semibold text-foreground">
                                    {profileUser.followerCount || 0}
                                </span>
                                <span>followers</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-[16px] font-semibold text-foreground">
                                    {totalLikes}
                                </span>
                                <span>likes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-4 py-3 sticky top-0 bg-background z-20 border-b border-border">
                <div className="bg-secondary rounded-full p-1 border border-border inline-flex">
                    {[
                        { value: ProfileTab.ACTIVITY, label: "Activity" },
                        { value: ProfileTab.STORIES, label: "Stories" },
                        { value: ProfileTab.CHARACTERS, label: "Characters" },
                        ...(isOwnProfile ? [{ value: ProfileTab.DRAFTS, label: "Drafts" }] : []),
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setSelectedTab(tab.value as ProfileTab)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-[12px] font-medium transition-all",
                                selectedTab === tab.value
                                    ? "bg-card text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground/80"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-4 py-4 pb-8">
                {selectedTab === ProfileTab.ACTIVITY && (
                    <ActivityTabContent userId={profileUser.id} />
                )}
                {selectedTab === ProfileTab.STORIES && (
                    <StoriesTabContent userId={profileUser.id} userName={profileUser.displayName || profileUser.username} />
                )}
                {selectedTab === ProfileTab.CHARACTERS && (
                    <CharactersTabContent userId={profileUser.id} userName={profileUser.displayName || profileUser.username} />
                )}
                {selectedTab === ProfileTab.DRAFTS && isOwnProfile && (
                    <DraftsTabContent />
                )}
            </div>
        </div>
    );
}

// Activity Tab Content
function ActivityTabContent({ userId }: { userId: string }) {
    return (
        <div className="space-y-4">
            {/* Heatmap Card */}
            <Card>
                <CardContent className="p-4">
                    <ActivityHeatmap />
                </CardContent>
            </Card>

            {/* Activity List */}
            <Card>
                <CardContent className="p-4">
                    <ActivityFeed userId={userId} />
                </CardContent>
            </Card>
        </div>
    );
}

// Stories Tab Content
function StoriesTabContent({ userId, userName }: { userId: string; userName: string }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Stories</h2>
                <Button variant="link" size="sm" asChild>
                    <span className="text-primary">See All</span>
                </Button>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="text-center py-12 text-muted-foreground">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No stories yet</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Characters Tab Content
function CharactersTabContent({ userId, userName }: { userId: string; userName: string }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Characters</h2>
                <Button variant="link" size="sm" asChild>
                    <span className="text-primary">See All</span>
                </Button>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="text-center py-12 text-muted-foreground">
                        <TheatertMasks className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No characters yet</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Drafts Tab Content (Own profile only)
function DraftsTabContent() {
    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="p-4">
                    <div className="text-center py-12 text-muted-foreground">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No drafts yet</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
