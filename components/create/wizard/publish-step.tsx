"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, Eye } from "lucide-react";
import { creation } from "@/lib/api/creation";
import { showSuccess, showError } from "@/lib/toast-utils";
import type { Storyboard, StoryboardScene } from "@/lib/types";

interface PublishStepProps {
    storyboardId: string;
    storyboard: Storyboard | null;
    scenes: StoryboardScene[];
    onBack: () => void;
    onPublish: (storyboardId: string) => void;
}

export function PublishStep({ storyboardId, storyboard, scenes, onBack, onPublish }: PublishStepProps) {
    const [publishing, setPublishing] = useState(false);

    const handlePublish = async () => {
        setPublishing(true);
        try {
            const result = await creation.publish(storyboardId);
            showSuccess("Published!", "Your storyboard has been published");
            onPublish(result.id || storyboardId);
        } catch (err) {
            console.error("Failed to publish:", err);
            showError("Publish Failed", "Failed to publish storyboard");
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Preview Header */}
            <div className="text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <h3 className="text-xl font-semibold">Ready to Publish</h3>
                <p className="text-sm text-muted-foreground">
                    Review your storyboard before publishing
                </p>
            </div>

            {/* Storyboard Info */}
            {storyboard && (
                <div className="p-4 border border-border rounded-xl space-y-2">
                    <h4 className="font-semibold">{storyboard.title}</h4>
                    {storyboard.content && (
                        <p className="text-sm text-muted-foreground line-clamp-3">{storyboard.content}</p>
                    )}
                    {storyboard.topic && (
                        <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                            #{storyboard.topic}
                        </span>
                    )}
                </div>
            )}

            {/* Scenes Preview */}
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                    {scenes.length} Scene{scenes.length !== 1 ? "s" : ""}
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {scenes.map((scene, i) => (
                        <div key={scene.id} className="flex gap-3 p-3 border border-border rounded-lg">
                            {scene.image ? (
                                <img src={scene.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                            ) : (
                                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                    <Eye className="w-5 h-5 text-muted-foreground" />
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">Scene {i + 1}: {scene.title}</p>
                                {scene.description && (
                                    <p className="text-xs text-muted-foreground line-clamp-2">{scene.description}</p>
                                )}
                                {scene.videoUrl && (
                                    <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">
                                        Has Video
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 border border-border bg-background hover:bg-muted text-foreground font-medium rounded-lg transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="flex-1 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-300 text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2"
                >
                    {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {publishing ? "Publishing..." : "Publish"}
                </button>
            </div>
        </div>
    );
}
