"use client";

import Link from "next/link";
import { Storyboard, StoryboardScene } from "@/lib/types";
import { Heart, MessageSquare, GitBranch, Copy } from "lucide-react";
import { useTranslation } from "@/providers/language-provider";

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
    const { t } = useTranslation();

    // Get first scene image for thumbnail
    const firstSceneImage = storyboard.storyboardScenes
        ?.find((scene) => scene.image)
        ?.image;
    const thumbnail = firstSceneImage || storyboard.image;

    return (
        <div
            className="group bg-card border border-border/60 hover:border-border/80 rounded-[16px] p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            onClick={onTap}
        >
            <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt={storyboard.title}
                            className="w-[84px] h-[84px] rounded-[12px] object-cover shadow-sm"
                        />
                    ) : (
                        <div className="w-[84px] h-[84px] rounded-[12px] bg-muted/50 flex items-center justify-center border border-border/50">
                            <Copy className="w-6 h-6 text-muted-foreground/50" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        {/* Title with Fork Badge */}
                        <div className="flex items-start justify-between mb-1.5">
                            <h3 className="text-[16px] font-bold text-foreground truncate pr-2">
                                {storyboard.title}
                            </h3>
                            {storyboard.parentId && !storyboard.isRoot && (
                                <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-secondary-foreground flex items-center gap-1">
                                    <GitBranch className="w-3 h-3" />
                                    {t("common.forks")}
                                </span>
                            )}
                        </div>

                        {/* Content Preview */}
                        {storyboard.content && (
                            <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                                {storyboard.content}
                            </p>
                        )}
                    </div>
                </div>

                {/* Creator Info (Top Right) */}
                {storyboard.creatorId && (
                    <div className="flex-shrink-0 -mt-1 -mr-1">
                        <button
                            className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-muted/50 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCreatorTap?.(storyboard.creatorId!);
                            }}
                        >
                            <span className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors max-w-[80px] truncate">
                                {storyboard.creatorName || "Unknown"}
                            </span>
                            <Avatar
                                src={storyboard.creatorAvatar}
                                name={storyboard.creatorName || "Unknown"}
                                size={20}
                            />
                        </button>
                    </div>
                )}
            </div>

            {/* Characters section */}
            {storyboard.characterRefs && storyboard.characterRefs.length > 0 && (
                <div className="mt-3 mb-3 flex gap-2 overflow-x-auto scrollbar-hide">
                    {storyboard.characterRefs.slice(0, 5).map((ref, index) => (
                        <button
                            key={`${ref.characterId}-${index}`}
                            className="flex items-center gap-1.5 px-1.5 py-1 rounded-full bg-secondary/30 border border-transparent hover:border-border/50 transition-colors whitespace-nowrap"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCharacterTap?.(ref.characterId);
                            }}
                        >
                            <Avatar
                                src={ref.avatarUrl}
                                name={ref.displayName || "Character"}
                                size={16}
                            />
                            <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[80px]">
                                {ref.displayName || "Character"}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <div className="h-px bg-border/40 my-3" />

            {/* Metrics Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{formatCount(storyboard.likes)} {t("groups.likes").toLowerCase()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{formatCount(storyboard.views || 0)} {t("common.views").toLowerCase()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>{formatCount(storyboard.forkCount || 0)} {t("common.forks").toLowerCase()}</span>
                    </div>
                </div>

                {/* Time */}
                {storyboard.createdAt && (
                    <div className="text-[11px] text-muted-foreground/60">
                        {new Date(storyboard.createdAt * 1000).toLocaleDateString()}
                    </div>
                )}
            </div>
        </div>
    );
}
