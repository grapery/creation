"use client";

import { useState } from "react";
import Image from "next/image";
import { Wand2, RefreshCw, Loader2 } from "lucide-react";
import { creation } from "@/lib/api/creation";
import type { StoryboardScene } from "@/lib/types";
import { showSuccess, showError } from "@/lib/toast-utils";

interface ImagesStepProps {
    storyboardId: string;
    scenes: StoryboardScene[];
    onScenesUpdate: (scenes: StoryboardScene[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export function ImagesStep({ storyboardId, scenes, onScenesUpdate, onNext, onBack }: ImagesStepProps) {
    const [generating, setGenerating] = useState(false);
    const [generatingSceneId, setGeneratingSceneId] = useState<string | null>(null);
    const [sceneStatuses, setSceneStatuses] = useState<Record<string, string>>({});

    const generateAllImages = async () => {
        setGenerating(true);
        try {
            const result = await creation.generateAllImages(storyboardId);
            if (result.results) {
                const updated = scenes.map(scene => {
                    const r = result.results.find(res => res.sceneId === scene.id);
                    if (r?.generation?.generatedImageUrl) {
                        return { ...scene, image: r.generation.generatedImageUrl };
                    }
                    return scene;
                });
                onScenesUpdate(updated);
            }
            showSuccess("Images Generated", `${result.successCount}/${result.total} scenes`);
        } catch (err) {
            console.error("Failed to generate images:", err);
            showError("Generation Failed", "Failed to generate scene images");
        } finally {
            setGenerating(false);
        }
    };

    const generateSingleImage = async (scene: StoryboardScene) => {
        setGeneratingSceneId(scene.id);
        setSceneStatuses(prev => ({ ...prev, [scene.id]: "generating" }));
        try {
            const result = await creation.generateImage(storyboardId, {
                sceneId: scene.id,
                sceneTitle: scene.title,
                sceneDescription: scene.description || scene.title,
            });
            if (result.generatedImageUrl) {
                const updated = scenes.map(s =>
                    s.id === scene.id ? { ...s, image: result.generatedImageUrl } : s
                );
                onScenesUpdate(updated);
            }
            setSceneStatuses(prev => ({ ...prev, [scene.id]: "completed" }));
        } catch (err) {
            console.error("Failed to generate image for scene:", err);
            setSceneStatuses(prev => ({ ...prev, [scene.id]: "failed" }));
        } finally {
            setGeneratingSceneId(null);
        }
    };

    const hasImages = scenes.some(s => s.image);
    const allHaveImages = scenes.length > 0 && scenes.every(s => s.image);

    return (
        <div className="space-y-4">
            {/* Generate All Button */}
            {!hasImages ? (
                <div className="p-8 bg-background border border-border rounded-xl text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto">
                        <Wand2 className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold">Generate Scene Images</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        AI will create visual representations for each scene based on your descriptions
                    </p>
                    <button
                        onClick={generateAllImages}
                        disabled={generating}
                        className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-300 text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2"
                    >
                        {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                        {generating ? "Generating..." : "Generate All Images"}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Images Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scenes.map((scene, index) => (
                            <div key={scene.id} className="relative rounded-xl overflow-hidden border border-border bg-muted group">
                                {scene.image ? (
                                    <Image src={scene.image} alt={scene.title} width={0} height={0} className="w-full h-[200px] object-cover" style={{ width: "100%", height: "auto" }} sizes="100vw" />
                                ) : (
                                    <div className="w-full h-[200px] flex flex-col items-center justify-center gap-2">
                                        {sceneStatuses[scene.id] === "generating" || generatingSceneId === scene.id ? (
                                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                        ) : (
                                            <>
                                                <p className="text-xs text-muted-foreground">{scene.title}</p>
                                                <button
                                                    onClick={() => generateSingleImage(scene)}
                                                    disabled={generatingSceneId !== null}
                                                    className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                                                >
                                                    Generate
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-white text-xs font-medium">Scene {index + 1}</span>
                                            <p className="text-white/80 text-[10px] line-clamp-1">{scene.title}</p>
                                        </div>
                                        {scene.image && (
                                            <button
                                                onClick={() => generateSingleImage(scene)}
                                                disabled={generatingSceneId !== null}
                                                className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                                            >
                                                <RefreshCw className="w-3 h-3 text-white" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Regenerate All */}
                    <button
                        onClick={generateAllImages}
                        disabled={generating}
                        className="w-full py-2.5 border border-border bg-background hover:bg-muted text-foreground font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <RefreshCw className="w-4 h-4" />
                        {generating ? "Regenerating..." : "Regenerate All"}
                    </button>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 border border-border bg-background hover:bg-muted text-foreground font-medium rounded-lg transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
                >
                    {allHaveImages ? "Next" : "Skip"}
                </button>
            </div>
        </div>
    );
}
