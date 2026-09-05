"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { fragments } from "@/lib/api/fragments";
import type { StoryFragment } from "@/lib/types";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface FragmentCardProps {
    fragment: StoryFragment;
    compact?: boolean;
    onLikeChange?: (id: string, isLiked: boolean, likes: number) => void;
}

export function FragmentCard({ fragment, compact = false, onLikeChange }: FragmentCardProps) {
    const [isLiked, setIsLiked] = useState(fragment.isLiked || false);
    const [likeCount, setLikeCount] = useState(fragment.likes || 0);

    const altText = fragment.caption || fragment.content.slice(0, 50);

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
            <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg">
                {/* Cover: 3:4, 破图/无图均走渐变文字兜底 */}
                <div className="relative aspect-[3/4] overflow-hidden">
                    <ImageWithFallback
                        src={fragment.imageUrls?.[0] || ""}
                        alt={altText}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        fallbackText={fragment.caption || fragment.content.slice(0, 60)}
                    />

                    {/* Multi-image indicator */}
                    {(fragment.imageUrls?.length ?? 0) > 1 && (
                        <div className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white backdrop-blur-sm">
                            {fragment.imageUrls.length}
                        </div>
                    )}

                    {/* AI badge */}
                    {fragment.sourceType === "ai_fragment_generation" && (
                        <span className="absolute bottom-2 right-2 flex rounded-full bg-black/60 p-1 text-white backdrop-blur-sm" title="AI generated">
                            <Sparkles className="h-3 w-3 text-[var(--ai-complete)]" />
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-2 p-3">
                    <p className={`text-sm leading-snug text-foreground ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
                        {fragment.caption || fragment.content}
                    </p>

                    {/* Topic + Author */}
                    <div className="flex items-center gap-1.5">
                        {fragment.creatorAvatar && (
                            <ImageWithFallback
                                src={fragment.creatorAvatar}
                                alt={fragment.creatorName || "avatar"}
                                width={20}
                                height={20}
                                sizes="20px"
                                className="rounded-full object-cover"
                                fallbackText=""
                            />
                        )}
                        <span className="truncate text-xs text-muted-foreground">
                            {fragment.creatorName || "Unknown"}
                        </span>
                        {fragment.topic && (
                            <span className="ml-auto max-w-[45%] truncate text-xs text-muted-foreground">
                                #{fragment.topic}
                            </span>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-1 transition-colors hover:text-red-500"
                        >
                            <Heart className={`h-3.5 w-3.5 transition-all ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                            {likeCount}
                        </button>
                        <span className="flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {fragment.comments || 0}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
