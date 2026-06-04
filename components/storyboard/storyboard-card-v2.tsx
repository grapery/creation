"use client";

import { useState } from "react";
import { Storyboard } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Heart, MessageSquare, Calendar, FileText, Bookmark } from "lucide-react";
import { likes, bookmarks } from "@/lib/api/interactions";

interface StoryboardCardProps {
    storyboard: Storyboard;
    href?: string;
    onLikeChange?: (id: string, isLiked: boolean, likes: number) => void;
    onBookmarkChange?: (id: string, isBookmarked: boolean) => void;
}

export default function StoryboardCard({ storyboard, href, onLikeChange, onBookmarkChange }: StoryboardCardProps) {
    const linkHref = href || `/storyboards/${storyboard.id}`;
    const [isLiked, setIsLiked] = useState(storyboard.isLiked || false);
    const [likeCount, setLikeCount] = useState(storyboard.likes || 0);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const prev = isLiked;
        const prevCount = likeCount;
        setIsLiked(!prev);
        setLikeCount(prev ? prevCount - 1 : prevCount + 1);
        try {
            if (prev) {
                await likes.unlike('storyboard_node', storyboard.id);
            } else {
                await likes.like('storyboard_node', storyboard.id);
            }
            onLikeChange?.(storyboard.id, !prev, prev ? prevCount - 1 : prevCount + 1);
        } catch (err) {
            console.error("Failed to toggle like:", err);
            setIsLiked(prev);
            setLikeCount(prevCount);
        }
    };

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const result = await bookmarks.toggleBookmark('storyboard', storyboard.id);
            setIsBookmarked(result.isBookmarked);
            onBookmarkChange?.(storyboard.id, result.isBookmarked);
        } catch (err) {
            console.error("Failed to toggle bookmark:", err);
        }
    };

    return (
        <Link href={linkHref}>
            <Card className="group cursor-pointer border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-4 sm:p-5">
                    {/* Cover Image */}
                    <div className="relative aspect-video rounded-lg bg-muted/30 mb-4 overflow-hidden">
                        {storyboard.image ? (
                            <img
                                src={storyboard.image}
                                alt={storyboard.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                <Layers className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                        )}

                        {/* Overlay with scene count */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-3 left-3 right-3">
                                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                    <FileText className="h-3.5 w-3.5 text-white/90" />
                                    <span className="text-xs font-medium text-white tabular-nums">
                                        {storyboard.sceneCount || 0} scenes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Storyboard Info */}
                    <div className="space-y-2.5">
                        <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                            {storyboard.title}
                        </h3>

                        {/* Description */}
                        {storyboard.content && (
                            <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                                {storyboard.content}
                            </p>
                        )}

                        {/* Metadata Row */}
                        <div className="flex items-center justify-between text-sm pt-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                {storyboard.createdAt && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>
                                            {new Date(storyboard.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric"
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleLike}
                                    className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                                    <span className="font-medium tabular-nums">{likeCount}</span>
                                </button>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span className="font-medium tabular-nums">{storyboard.comments || 0}</span>
                                </span>
                                <button
                                    onClick={handleBookmark}
                                    className="text-muted-foreground hover:text-amber-500 transition-colors"
                                >
                                    <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
