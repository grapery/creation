"use client";

import { StoryScene } from "@/lib/types";
import { Plus, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/language-provider";

interface StoryScenesSectionProps {
    title: string;
    scenes: StoryScene[];
    storyId: string;
    isLoading?: boolean;
    error?: string;
    onAddScene?: () => void;
}

export function StoryScenesSection({
    title,
    scenes,
    storyId: _storyId,
    isLoading = false,
    error,
    onAddScene
}: StoryScenesSectionProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">
                    {title} ({scenes.length})
                </h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAddScene}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-semibold">{t("story_detail.empty.add_scene", "Add Scene")}</span>
                </Button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="bg-card border border-border/8 rounded-2xl p-10 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3" />
                    <p className="text-sm text-muted-foreground">{t("common.loading", "Loading...")}</p>
                </div>
            ) : error ? (
                <div className="bg-card border border-border/8 rounded-2xl p-6 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground mb-1">{t("story_detail.error.title", "Unable to load scenes")}</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
            ) : scenes.length === 0 ? (
                <div className="bg-card border border-border/8 rounded-2xl p-6 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground mb-1">{t("story_detail.empty.no_scenes_title", "No scenes yet")}</p>
                    <p className="text-sm text-muted-foreground">{t("story_detail.empty.no_scenes_message", "Add scenes to structure your story")}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {scenes.map((scene) => (
                        <SceneRow key={scene.id} scene={scene} />
                    ))}
                </div>
            )}
        </div>
    );
}

interface SceneRowProps {
    scene: StoryScene;
}

function SceneRow({ scene }: SceneRowProps) {
    return (
        <div className="bg-card border border-border/8 rounded-2xl p-4 space-y-3 cursor-pointer hover:bg-accent/5 transition-colors">
            {/* Main Content */}
            <div className="flex gap-3.5">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                    {scene.image ? (
                        <img
                            src={scene.image}
                            alt={scene.title}
                            className="w-23 h-23 rounded-xl object-cover"
                            style={{ width: 92, height: 92 }}
                        />
                    ) : (
                        <div
                            className="w-23 h-23 rounded-xl bg-muted flex items-center justify-center"
                            style={{ width: 92, height: 92 }}
                        >
                            <ImageIcon className="w-7 h-7 text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-foreground truncate mb-1">
                        {scene.title}
                    </h3>
                    {scene.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {scene.description}
                        </p>
                    )}
                </div>

                {/* Chevron */}
                <div className="text-muted-foreground">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* Tags */}
            {scene.tags && scene.tags.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {scene.tags.map((tag, index) => (
                        <span
                            key={`${tag}-${index}`}
                            className="px-3 py-1.5 rounded-full bg-muted text-xs font-semibold text-foreground whitespace-nowrap"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
