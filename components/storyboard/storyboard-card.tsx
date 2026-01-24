"use client";

import Link from "next/link";
import { Storyboard, StoryboardScene } from "@/lib/types";
import { Heart, MessageSquare, GitBranch, Copy } from "lucide-react";

interface StoryboardCardProps {
    storyboard: Storyboard;
    onTap?: () => void;
    onLike?: () => void;
    onCreatorTap?: (creatorId: string) => void;
    onCharacterTap?: (characterId: string) => void;
}

// Avatar component inline
function Avatar({ src, name, size = 24 }: { src?: string; name?: string; size?: number }) {
    const initial = name && name.length > 0 ? name[0].toUpperCase() : "?";
    return (
        <div
            className="rounded-full overflow-hidden bg-gradient-to-br from-purple-400/60 to-blue-400/60 flex items-center justify-center border border-border"
            style={{ width: size, height: size }}
        >
            {src ? (
                <img src={src} alt={name || "avatar"} className="w-full h-full object-cover" />
            ) : (
                <span
                    className="text-white font-bold"
                    style={{ fontSize: size * 0.4 }}
                >
                    {initial}
                </span>
            )}
        </div>
    );
}

// Helper to format count (e.g., 1.5K, 2M)
function formatCount(value: number = 0): string {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1).replace(".0", "")}M`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1).replace(".0", "")}K`;
    }
    return String(value);
}

export function StoryboardCard({
    storyboard,
    onTap,
    onLike,
    onCreatorTap,
    onCharacterTap,
}: StoryboardCardProps) {
    // Get first scene image for thumbnail
    const firstSceneImage = storyboard.storyboardScenes
        ?.find((scene) => scene.image)
        ?.image;
    const thumbnail = firstSceneImage || storyboard.image;

    return (
        <div
            className="bg-background border border-border/8 rounded-[18px] p-3.5 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
            onClick={onTap}
        >
            <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt={storyboard.title}
                            className="w-[76px] h-[76px] rounded-[10px] object-cover"
                        />
                    ) : (
                        <div className="w-[76px] h-[76px] rounded-[10px] bg-muted flex items-center justify-center">
                            <Copy className="w-6 h-6 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title with Fork Badge */}
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-[15px] font-semibold text-foreground truncate">
                            {storyboard.title}
                        </h3>
                        {storyboard.parentId && !storyboard.isRoot && (
                            <span className="px-2 py-1 rounded-full bg-muted text-[11px] font-medium text-foreground">
                                Fork
                            </span>
                        )}
                    </div>

                    {/* Content Preview */}
                    {storyboard.content && (
                        <p className="text-[13px] text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                            {storyboard.content}
                        </p>
                    )}

                    {/* Metrics Row */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-semibold text-foreground">
                                {formatCount(storyboard.likes)}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                                likes
                            </span>
                        </div>
                        
                        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-semibold text-foreground">
                                {formatCount(storyboard.views || 0)}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                                views
                            </span>
                        </div>
                        
                        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-semibold text-foreground">
                                {formatCount(storyboard.forkCount || 0)}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                                forks
                            </span>
                        </div>
                    </div>

                    {/* Time */}
                    {storyboard.createdAt && (
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1.5">
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                            {new Date(storyboard.createdAt).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {/* Creator Info (Optional) */}
                {storyboard.creatorId && (
                    <div className="flex-shrink-0 ml-2">
                        <button
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-border hover:bg-muted/50 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCreatorTap?.(storyboard.creatorId!);
                            }}
                        >
                            <Avatar
                                src={storyboard.creatorAvatar}
                                name={storyboard.creatorName || "Unknown"}
                                size={20}
                            />
                            <span className="text-xs font-medium text-foreground truncate max-w-[80px]">
                                {storyboard.creatorName || "Unknown"}
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {/* Characters section */}
            {storyboard.characterRefs && storyboard.characterRefs.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                    {storyboard.characterRefs.slice(0, 5).map((ref, index) => (
                        <button
                            key={`${ref.characterId}-${index}`}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border hover:bg-muted/50 transition-colors whitespace-nowrap"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCharacterTap?.(ref.characterId);
                            }}
                        >
                            <Avatar
                                src={ref.avatarUrl}
                                name={ref.displayName || "Character"}
                                size={20}
                            />
                            <span className="text-xs text-foreground truncate max-w-[80px]">
                                {ref.displayName || "Character"}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
