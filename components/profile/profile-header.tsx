"use client";

import Link from "next/link";
import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Share2, Crown, MessageSquare } from "lucide-react";

interface ProfileHeaderProps {
    user: User;
    isOwnProfile?: boolean;
    isFollowing?: boolean;
    likesCount?: number;
    onAvatarTap?: () => void;
    onEditProfile?: () => void;
    onShare?: () => void;
    onFollow?: () => void;
    onMessage?: () => void;
}

export function ProfileHeader({
    user,
    isOwnProfile = false,
    isFollowing = false,
    likesCount = 0,
    onAvatarTap,
    onEditProfile,
    onShare,
    onFollow,
    onMessage,
}: ProfileHeaderProps) {
    const formatJoinedDate = (timestamp?: number) => {
        if (!timestamp) return "";
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit" });
    };

    return (
        <Card className="mb-4 overflow-hidden">
            {/* Banner */}
            <div className="h-[160px] relative">
                {user.background ? (
                    <img
                        src={user.background}
                        alt="Cover"
                        className="w-full h-full object-cover blur-xl"
                    />
                ) : user.avatar ? (
                    <img
                        src={user.avatar}
                        alt="Cover"
                        className="w-full h-full object-cover blur-xl"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/80 via-primary/60 to-background" />
                )}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <CardContent className="px-4 pb-4 relative">
                {/* Avatar + Actions Row */}
                <div className="flex items-end justify-between gap-4 mb-3 -mt-11">
                    {/* Avatar */}
                    <button
                        onClick={onAvatarTap}
                        className="relative w-[88px] h-[88px] rounded-full border-[4px] border-background shadow-[0_5px_4px_rgba(0,0,0,0.1)] overflow-hidden flex-shrink-0"
                    >
                        <Avatar className="w-full h-full">
                            {user.avatar ? (
                                <AvatarImage src={user.avatar} alt={user.displayName || user.username} />
                            ) : (
                                <AvatarFallback className="text-4xl font-bold bg-background">
                                    {(user.displayName || user.username)?.[0]?.toUpperCase() || "?"}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </button>

                    <div className="flex-1" />

                    {/* Action Buttons */}
                    <div className="flex gap-2 pb-2 items-end">
                        {isOwnProfile ? (
                            <>
                                <button
                                    onClick={onEditProfile}
                                    className="px-4 h-8 bg-transparent text-foreground border border-border rounded-full text-sm font-medium"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={onShare}
                                    className="flex items-center gap-1 px-3 h-8 bg-transparent text-foreground border border-border rounded-full text-sm font-medium"
                                >
                                    <Share2 className="w-3 h-3" />
                                    <span>Share</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onFollow}
                                    className={`px-4 h-8 rounded-full text-sm font-medium ${
                                        isFollowing
                                            ? "bg-transparent text-foreground border border-border"
                                            : "bg-primary text-white border-transparent"
                                    }`}
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </button>
                                <button
                                    onClick={onMessage}
                                    className="w-8 h-8 rounded-full bg-transparent text-foreground border border-border flex items-center justify-center"
                                >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* User Info */}
                <div className="space-y-2 mb-4">
                    {/* Name and VIP */}
                    <div className="flex items-center gap-1.5">
                        <h1 className="text-[24px] font-bold text-foreground">
                            {user.displayName || user.username}
                        </h1>
                        {user.isVip && (
                            <div className="flex items-center gap-0.5 text-orange-500">
                                <Crown className="w-3.5 h-3.5 fill="currentColor" />
                            </div>
                        )}
                    </div>

                    {/* Username and Joined Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>@{user.username}</span>
                        {user.createdAt && (
                            <>
                                <span>·</span>
                                <span>Joined {formatJoinedDate(user.createdAt)}</span>
                            </>
                        )}
                    </div>

                    {/* Bio */}
                    {user.bio && (
                        <p className="text-[15px] text-foreground line-clamp-3 max-w-full">
                            {user.bio}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <span className="text-[16px] font-semibold text-foreground">
                                {user.followingCount || user.following || 0}
                            </span>
                            <span>following</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[16px] font-semibold text-foreground">
                                {user.followerCount || user.followers || 0}
                            </span>
                            <span>followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[16px] font-semibold text-foreground">
                                {likesCount}
                            </span>
                            <span>likes</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
