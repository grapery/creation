"use client";

import Link from "next/link";
import { Storyboard } from "@/lib/types";
import { Heart, Eye, GitBranch, Sparkles, Layers } from "lucide-react";
import { useTranslation } from "@/providers/language-provider";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface StoryboardCardProps {
    storyboard: Storyboard;
    href?: string;
    /** 首屏主图传 true 提前加载 */
    priority?: boolean;
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

/**
 * 封面竖卡：3:4 首场景封面 + 角标（fork / 场景数 / #topic / AI）+ 标题 + 作者 + 统计。
 * 自适应列宽，用于发现类网格（首页 / plaza / 搜索 / 分支推荐）。
 */
export function StoryboardCard({ storyboard, href, priority }: StoryboardCardProps) {
    const { t } = useTranslation();

    const cover =
        storyboard.storyboardScenes?.find((scene) => scene.image)?.image ||
        storyboard.image ||
        storyboard.images?.[0] ||
        "";

    return (
        <Link
            href={href ?? `/storyboards/${storyboard.id}`}
            className="group block rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5"
        >
            {/* Cover */}
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <ImageWithFallback
                    src={cover || ""}
                    alt={storyboard.title}
                    fill
                    priority={priority}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    fallbackText={storyboard.title}
                />

                {/* Top-left: fork badge */}
                {storyboard.parentId && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                        <GitBranch className="h-3 w-3" />
                        {t("storyboard.forked", "Fork")}
                    </span>
                )}

                {/* Top-right: scene count */}
                {(storyboard.sceneCount ?? storyboard.storyboardScenes?.length) ? (
                    <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                        <Layers className="h-3 w-3" />
                        {storyboard.sceneCount ?? storyboard.storyboardScenes?.length} {t("create_chat.scenes", "scenes")}
                    </span>
                ) : null}

                {/* Bottom-left: topic */}
                {storyboard.topic && (
                    <span className="absolute bottom-2 left-2 max-w-[70%] truncate rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                        #{storyboard.topic}
                    </span>
                )}

                {/* Bottom-right: AI badge */}
                {storyboard.isAIGenerated && (
                    <span className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm" title={t("storyboard.ai_generated", "AI generated")}>
                        <Sparkles className="h-3 w-3 text-[var(--ai-complete)]" />
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="space-y-1.5 p-3">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                    {storyboard.title}
                </h3>

                {storyboard.content && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {storyboard.content}
                    </p>
                )}

                <div className="flex items-center justify-between pt-0.5">
                    <div className="flex min-w-0 items-center gap-1.5">
                        <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-purple-400/60 to-blue-400/60">
                            {storyboard.creatorAvatar && (
                                <ImageWithFallback
                                    src={storyboard.creatorAvatar}
                                    alt={storyboard.creatorName || "avatar"}
                                    fill
                                    sizes="20px"
                                    className="object-cover"
                                    fallbackText={storyboard.creatorName?.[0] ?? ""}
                                />
                            )}
                        </div>
                        <span className="truncate text-xs text-muted-foreground">
                            {storyboard.creatorName || storyboard.author || t("common.unknown", "Unknown")}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {formatCount(storyboard.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatCount(storyboard.views || 0)}
                    </span>
                    <span className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        {formatCount(storyboard.forkCount || 0)}
                    </span>
                    {storyboard.createdAt && (
                        <span className="ml-auto">
                            {new Date(storyboard.createdAt * 1000).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
