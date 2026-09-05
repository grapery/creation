"use client";

import "next/link";
import Image from "next/image";
import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Crown, MessageSquare, Edit } from "lucide-react";

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

export default function ProfileHeader({
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
        <Card className="mb-6 overflow-hidden border-border/50 shadow-sm">
            {/* Banner - Improved height and visual hierarchy */}
            <div className="h-[180px] md:h-[220px] w-full relative bg-gradient-to-br from-primary/20 via-primary/10 to-background">
                {user.background ? (
                    <>
<Image src={user.background} alt="Cover" fill sizes="100vw" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/20 to-background" />
                )}
            </div>

            <CardContent className="px-4 sm:px-6 pb-5 sm:pb-6 relative">
                {/* Avatar + Actions Row - Improved spacing and alignment */}
                <div className="flex items-end justify-between gap-4 sm:gap-6 mb-4 -mt-10 sm:-mt-12">
                    {/* Avatar - Better sizing and positioning */}
                    <button
                        onClick={onAvatarTap}
                        className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
                        style={{ borderRadius: '9999px' }}
                    >
                        <div className="w-full h-full rounded-full border-[4px] border-background shadow-lg overflow-hidden bg-background">
                            <Avatar className="w-full h-full">
                                {user.avatar ? (
                                    <AvatarImage src={user.avatar} alt={user.displayName || user.username} />
                                ) : (
                                    <AvatarFallback className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-primary/20 to-secondary/20">
                                        {(user.displayName || user.username)?.[0]?.toUpperCase() || "?"}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        </div>
                    </button>

                    <div className="flex-1 min-w-0" />

                    {/* Action Buttons - Improved visual feedback */}
                    <div className="flex gap-2 sm:gap-3 pb-1">
                        {isOwnProfile ? (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onEditProfile}
                                    className="gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span className="hidden sm:inline">Edit Profile</span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onShare}
                                    className="gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Share</span>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    size="sm"
                                    variant={isFollowing ? "outline" : "default"}
                                    onClick={onFollow}
                                    className="gap-2"
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onMessage}
                                    className="gap-2"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="hidden sm:inline">Message</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* User Info - Improved typography and spacing */}
                <div className="space-y-2.5">
                    {/* Name and VIP Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                            {user.displayName || user.username}
                        </h1>
                        {user.isVip && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20">
                                <Crown className="w-4 h-4 text-orange-500" />
                                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">VIP</span>
                            </div>
                        )}
                    </div>

                    {/* Username and Joined Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">@{user.username}</span>
                        {user.createdAt && (
                            <>
                                <span className="text-muted-foreground/50">·</span>
                                <span>Joined {formatJoinedDate(user.createdAt)}</span>
                            </>
                        )}
                    </div>

                    {/* Bio - Better readability */}
                    {user.bio && (
                        <p className="text-[15px] text-foreground/80 leading-relaxed max-w-full">
                            {user.bio}
                        </p>
                    )}

                    {/* Stats - Improved layout and visual hierarchy */}
                    <div className="flex items-center gap-6 sm:gap-8 pt-2 text-xs">
                        <div className="flex items-center gap-1.5 group cursor-pointer hover:text-foreground transition-colors">
                            <span className="text-sm font-semibold tabular-nums">
                                {user.followingCount || user.following || 0}
                            </span>
                            <span className="text-muted-foreground group-hover:text-muted-foreground/80">
                                following
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 group cursor-pointer hover:text-foreground transition-colors">
                            <span className="text-sm font-semibold tabular-nums">
                                {user.followerCount || user.followers || 0}
                            </span>
                            <span className="text-muted-foreground group-hover:text-muted-foreground/80">
                                followers
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 group cursor-pointer hover:text-foreground transition-colors">
                            <span className="text-sm font-semibold tabular-nums">
                                {likesCount}
                            </span>
                            <span className="text-muted-foreground group-hover:text-muted-foreground/80">
                                likes
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
