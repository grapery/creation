"use client";

import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Share2, Bell, MoreHorizontal, MessageSquare, Crown, Calendar, Users, User as UserIcon, FileText, Masks, Heart } from "lucide-react";
import Link from "next/link";

interface SocialProfileHeaderProps {
    userId: string;
    user: User;
    isOwnProfile: boolean;
    isFollowing?: boolean;
    likesCount?: number;
    onBack?: () => void;
    onAvatarTap?: () => void;
    onSettings?: () => void;
    onShare?: () => void;
    onMore?: () => void;
    onEditProfile?: () => void;
    onFollow?: () => void;
    onMessage?: () => void;
}

export function SocialProfileHeader({
    userId,
    user,
    isOwnProfile,
    isFollowing = false,
    likesCount = 0,
    onBack,
    onAvatarTap,
    onSettings,
    onShare,
    onMore,
    onEditProfile,
    onFollow,
    onMessage,
}: SocialProfileHeaderProps) {
    const formatJoinedDate = (timestamp?: number) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    };

    return (
        <div>
            {/* Cover + Avatar + Action Button Zone */}
            <div className="relative">
                {/* Cover Background */}
                <div className="h-[220px] w-full relative">
                    {user.background ? (
                        <img
                            src={user.background}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/80 via-primary/60 to-background" />
                    )}

                    {/* Subtle gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

                    {/* Top Bar Actions */}
                    <div className="absolute top-3 right-4 flex gap-2">
                        {isOwnProfile ? (
                            <>
                                {onSettings && (
                                    <button
                                        onClick={onSettings}
                                        className="w-9 h-9 rounded-full flex items-center justify-center bg-transparent text-white shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                                    >
                                        <Settings className="w-5 h-5" strokeWidth={2} />
                                    </button>
                                )}
                                {onSettings && (
                                    <button
                                        onClick={onSettings}
                                        className="w-9 h-9 rounded-full flex items-center justify-center bg-transparent text-white shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                                    >
                                        <Bell className="w-5 h-5" strokeWidth={2} />
                                    </button>
                                )}
                            </>
                        ) : (
                            onMore && (
                                <button
                                    onClick={onMore}
                                    className="w-9 h-9 rounded-full flex items-center justify-center bg-black/35 text-white"
                                >
                                    <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Avatar and action button row */}
                <div className="absolute -bottom-10 left-4 right-4 flex items-end justify-between px-4">
                    {/* Avatar */}
                    <button
                        onClick={onAvatarTap}
                        className="relative w-[80px] h-[80px] rounded-full border-[3px] border-background shadow-[0_8px_4px_rgba(0,0,0,0.15)]"
                    >
                        <Avatar className="w-full h-full">
                            {user.avatar ? (
                                <AvatarImage src={user.avatar} alt={user.displayName || user.username} />
                            ) : (
                                <AvatarFallback className="text-2xl font-bold bg-secondary">
                                    {(user.displayName || user.username)?.[0]?.toUpperCase() || "?"}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </button>

                    <div className="flex-1" />

                    {/* Primary Action Button */}
                    <div className="flex gap-2 items-center">
                        {isOwnProfile && onEditProfile ? (
                            <button
                                onClick={onEditProfile}
                                className="px-4 py-2.5 bg-card shadow-[0_4px_2px_rgba(0,0,0,0.1)] rounded-full text-sm font-medium text-foreground border border-border"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                {onMessage && (
                                    <button
                                        onClick={onMessage}
                                        className="w-9 h-9 rounded-full flex items-center justify-center bg-card border border-border"
                                    >
                                        <MessageSquare className="w-4 h-4 text-foreground" strokeWidth={2} />
                                    </button>
                                )}

                                {onFollow && (
                                    <button
                                        onClick={onFollow}
                                        className={`px-4 py-2.5 rounded-full text-sm font-semibold flex items-center gap-1 ${
                                            isFollowing
                                                ? "bg-card text-foreground border border-border"
                                                : "bg-primary text-white border-transparent"
                                        }`}
                                    >
                                        {isFollowing ? (
                                            <>
                                                <span>Following</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="w-3.5 h-3.5">+</span>
                                                <span>Follow</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Identity section (name, username, joined date) */}
            <div className="px-4 pt-3 space-y-1">
                <div className="flex items-center gap-1.5">
                    <h1 className="text-[20px] font-bold text-foreground">
                        {user.displayName || user.username}
                    </h1>
                    {user.isVip && <VipBadge />}
                </div>

                {user.username && (
                    <div className="text-[14px] text-muted-foreground">
                        @{user.username}
                    </div>
                )}

                {user.createdAt && (
                    <div className="flex items-center gap-1 text-[12px] text-muted-foreground pt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {formatJoinedDate(user.createdAt)}</span>
                    </div>
                )}
            </div>

            {/* Bio section */}
            {user.bio && (
                <div className="px-4 pt-2 pb-2">
                    <p className="text-sm text-foreground line-clamp-3 max-w-full">
                        {user.bio}
                    </p>
                </div>
            )}

            {/* Stats row */}
            <div className="px-4 pt-4 pb-4">
                <div className="flex gap-0">
                    {/* Following */}
                    <Link href={`/profile/${userId}/following`} className="flex-1">
                        <div className="px-4 py-3 bg-card rounded-lg border border-border">
                            <div className="flex flex-col items-center gap-1">
                                <Users className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                                <span className="text-[16px] font-bold text-foreground">
                                    {user.followingCount || user.following || 0}
                                </span>
                                <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Following</span>
                            </div>
                        </div>
                    </Link>

                    {/* Followers */}
                    <Link href={`/profile/${userId}/followers`} className="flex-1">
                        <div className="px-4 py-3 bg-card rounded-lg border border-border">
                            <div className="flex flex-col items-center gap-1">
                                <UserIcon className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                                <span className="text-[16px] font-bold text-foreground">
                                    {user.followerCount || user.followers || 0}
                                </span>
                                <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Followers</span>
                            </div>
                        </div>
                    </Link>

                    {/* Stories */}
                    <div className="flex-1">
                        <div className="px-4 py-3 bg-card rounded-lg border border-border">
                            <div className="flex flex-col items-center gap-1">
                                <FileText className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                                <span className="text-[16px] font-bold text-foreground">
                                    {user.storyCount || 0}
                                </span>
                                <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Stories</span>
                            </div>
                        </div>
                    </div>

                    {/* Characters */}
                    <div className="flex-1">
                        <div className="px-4 py-3 bg-card rounded-lg border border-border">
                            <div className="flex flex-col items-center gap-1">
                                <Masks className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                                <span className="text-[16px] font-bold text-foreground">
                                    {user.characterCount || 0}
                                </span>
                                <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Characters</span>
                            </div>
                        </div>
                    </div>

                    {/* Likes */}
                    <div className="flex-1">
                        <div className="px-4 py-3 bg-card rounded-lg border border-border">
                            <div className="flex flex-col items-center gap-1">
                                <Heart className="w-3 h-3 text-destructive" fill="currentColor" strokeWidth={2} />
                                <span className="text-[16px] font-bold text-foreground">
                                    {user.totalLikes || likesCount}
                                </span>
                                <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Likes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// VIP Badge Component
function VipBadge() {
    return (
        <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full">
            <Crown className="w-[10px] h-[10px] text-white" />
            <span className="text-[10px] font-semibold text-white">VIP</span>
        </div>
    );
}
