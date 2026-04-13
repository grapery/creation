"use client";

import Link from "next/link";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import type { StoryFragment } from "@/lib/types";

interface FragmentCardProps {
    fragment: StoryFragment;
    compact?: boolean;
}

export function FragmentCard({ fragment, compact = false }: FragmentCardProps) {
    return (
        <Link href={`/fragments/${fragment.id}`} className="block group">
            <div className={`relative rounded-xl overflow-hidden border border-border bg-card transition-all hover:shadow-lg hover:border-primary/30 ${compact ? "w-[120px]" : "w-full"}`}>
                {/* Image */}
                {fragment.imageUrls && fragment.imageUrls.length > 0 ? (
                    <div className={`relative overflow-hidden ${compact ? "h-[160px]" : "h-[200px]"}`}>
                        <img
                            src={fragment.imageUrls[0]}
                            alt={fragment.caption || fragment.content.slice(0, 50)}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
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
                            <img src={fragment.creatorAvatar} alt="" className="w-5 h-5 rounded-full" />
                        )}
                        <span className="text-xs text-muted-foreground truncate">
                            {fragment.creatorName || "Unknown"}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Heart className={`w-3.5 h-3.5 ${fragment.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                            {fragment.likes || 0}
                        </span>
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
