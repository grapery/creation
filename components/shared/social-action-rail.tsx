"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Repeat2, UserPlus } from "lucide-react";

interface SocialActionRailProps {
    creatorAvatar?: string;
    creatorName?: string;
    isFollowing?: boolean;
    onFollow?: () => void;
    isLiked?: boolean;
    likes?: number;
    onLike?: () => void;
    comments?: number;
    onComment?: () => void;
    shares?: number;
    onShare?: () => void;
    isBookmarked?: boolean;
    onBookmark?: () => void;
    showConvert?: boolean;
    onConvert?: () => void;
    size?: "sm" | "md";
}

export function SocialActionRail({
    creatorAvatar,
    creatorName,
    isFollowing,
    onFollow,
    isLiked,
    likes = 0,
    onLike,
    comments = 0,
    onComment,
    shares = 0,
    onShare,
    isBookmarked,
    onBookmark,
    showConvert,
    onConvert,
    size = "md",
}: SocialActionRailProps) {
    const [heartAnim, setHeartAnim] = useState(false);

    const iconSize = size === "sm" ? "w-6 h-6" : "w-7 h-7";
    const textSize = size === "sm" ? "text-[10px]" : "text-xs";

    const handleLike = () => {
        if (!isLiked) {
            setHeartAnim(true);
            setTimeout(() => setHeartAnim(false), 600);
        }
        onLike?.();
    };

    const formatCount = (n: number) => {
        if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
        return n.toString();
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Creator avatar + follow */}
            {creatorAvatar && (
                <div className="relative">
                    <img
                        src={creatorAvatar}
                        alt={creatorName || ""}
                        className={`${size === "sm" ? "w-9 h-9" : "w-10 h-10"} rounded-full border-2 border-white`}
                    />
                    {!isFollowing && onFollow && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onFollow(); }}
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-black"
                        >
                            <UserPlus className="w-2.5 h-2.5 text-primary-foreground" />
                        </button>
                    )}
                </div>
            )}

            {/* Like */}
            <button
                onClick={(e) => { e.stopPropagation(); handleLike(); }}
                className="flex flex-col items-center gap-0.5"
            >
                <div className="relative">
                    <Heart
                        className={`${iconSize} transition-all ${
                            isLiked ? "text-red-500 fill-red-500 scale-110" : "text-white"
                        } ${heartAnim ? "scale-125" : ""}`}
                    />
                    {heartAnim && (
                        <div className="absolute inset-0 animate-ping">
                            <Heart className={`${iconSize} text-red-400 fill-red-400 opacity-50`} />
                        </div>
                    )}
                </div>
                <span className={`${textSize} text-white`}>{formatCount(likes)}</span>
            </button>

            {/* Comment */}
            <button
                onClick={(e) => { e.stopPropagation(); onComment?.(); }}
                className="flex flex-col items-center gap-0.5"
            >
                <MessageCircle className={`${iconSize} text-white`} />
                <span className={`${textSize} text-white`}>{formatCount(comments)}</span>
            </button>

            {/* Convert to story */}
            {showConvert && onConvert && (
                <button
                    onClick={(e) => { e.stopPropagation(); onConvert(); }}
                    className="flex flex-col items-center gap-0.5"
                >
                    <Repeat2 className={`${iconSize} text-white`} />
                    <span className={`${textSize} text-white`}>Story</span>
                </button>
            )}

            {/* Bookmark */}
            {onBookmark && (
                <button
                    onClick={(e) => { e.stopPropagation(); onBookmark(); }}
                    className="flex flex-col items-center gap-0.5"
                >
                    <Bookmark
                        className={`${iconSize} ${isBookmarked ? "text-yellow-400 fill-yellow-400" : "text-white"}`}
                    />
                </button>
            )}

            {/* Share */}
            <button
                onClick={(e) => { e.stopPropagation(); onShare?.(); }}
                className="flex flex-col items-center gap-0.5"
            >
                <Share2 className={`${iconSize} text-white`} />
                <span className={`${textSize} text-white`}>{formatCount(shares)}</span>
            </button>
        </div>
    );
}
