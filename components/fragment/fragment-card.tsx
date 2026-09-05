"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { fragments } from "@/lib/api/fragments";
import type { StoryFragment } from "@/lib/types";

interface FragmentCardProps {
    fragment: StoryFragment;
    compact?: boolean;
    onLikeChange?: (id: string, isLiked: boolean, likes: number) => void;
}

export function FragmentCard({ fragment, compact = false, onLikeChange }: FragmentCardProps) {
    const [isLiked, setIsLiked] = useState(fragment.isLiked || false);
    const [likeCount, setLikeCount] = useState(fragment.likes || 0);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const prev = isLiked;
        const prevCount = likeCount;
        setIsLiked(!prev);
        setLikeCount(prev ? prevCount - 1 : prevCount + 1);
        try {
            if (prev) {
                await fragments.unlike(fragment.id);
            } else {
                await fragments.like(fragment.id);
            }
            onLikeChange?.(fragment.id, !prev, prev ? prevCount - 1 : prevCount + 1);
        } catch (err) {
            console.error("Failed to toggle like:", err);
            setIsLiked(prev);
            setLikeCount(prevCount);
        }
    };

    return (
        <Link href={`/fragments/${fragment.id}`} className="block group">
            <div className={`relative rounded-xl overflow-hidden border border-border bg-card transition-all hover:shadow-lg hover:border-primary/30 ${compact ? "w-[120px]" : "w-full"}`}>
                {/* Image */}
                {fragment.imageUrls && fragment.imageUrls.length > 0 ? (
                    <div className={`relative overflow-hidden ${compact ? "h-[160px]" : "h-[200px]"}`}>
                        <Image src={fragment.imageUrls[0]} alt={fragment.caption || fragment.content.slice(0, 50)} width={0} height={0} className="w-full h-full object-cover transition-transform group-hover:scale-105" style={{ width: "100%", height: "100%" }} sizes="100vw" />
                        {/* Multi-image indicator */}
                        {fragment.imageUrls.length > 1 && (
                            <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-white text-xs backdrop-blur-sm">
                                {fragment.imageUrls.length}
                            </div>
                        )}
                        {/* Topic badge */}
                        {fragment.topic && (
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded-full text-white text-xs backdrop-blur-sm">
                                #{fragment.topic}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={`bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center ${compact ? "h-[160px]" : "h-[200px]"}`}>
                        <p className="text-sm text-muted-foreground p-4 line-clamp-3 text-center">
                            {fragment.content.slice(0, 80)}
                        </p>
                    </div>
                )}

                {/* Content */}
                <div className="p-3 space-y-2">
                    {/* Caption/Content */}
                    <p className={`text-sm text-foreground leading-snug ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
                        {fragment.caption || fragment.content}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-2">
                        {fragment.creatorAvatar && (
                            <Image src={fragment.creatorAvatar} alt="" width={20} height={20} className="rounded-full" sizes="20px" />
                        )}
                        <span className="text-xs text-muted-foreground truncate">
                            {fragment.creatorName || "Unknown"}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        >
                            <Heart className={`w-3.5 h-3.5 transition-all ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                            {likeCount}
                        </button>
                        <span className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            {fragment.comments || 0}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
