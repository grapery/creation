"use client";

import { useState, useEffect } from "react";
import { Wand2, ChevronUp, ChevronDown, Loader2, Sparkles } from "lucide-react";
import type { Character, FragmentStyle } from "@/lib/types";
import { fragments } from "@/lib/api/fragments";

interface SetupStepProps {
    data: {
        storyId: string;
        rawInput: string;
        style: string;
        sceneCount: number;
        characters: Character[];
    };
    onChange: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
    creating?: boolean;
}

export function SetupStep({ data, onChange, onNext, onBack, creating = false }: SetupStepProps) {
    const [enhancing, setEnhancing] = useState(false);
    const [styles, setStyles] = useState<FragmentStyle[]>([]);
    const [loadingStyles, setLoadingStyles] = useState(false);

    useEffect(() => {
        loadStyles();
    }, []);

    const loadStyles = async () => {
        setLoadingStyles(true);
        try {
            const res = await fragments.getStyles();
            setStyles(res.styles);
        } catch (err) {
            console.error("Failed to load styles:", err);
        } finally {
            setLoadingStyles(false);
        }
    };

    const adjustSceneCount = (delta: number) => {
        const newCount = Math.max(2, Math.min(8, data.sceneCount + delta));
        onChange({ ...data, sceneCount: newCount });
    };

    const handleAIEnhance = async () => {
        if (!data.rawInput.trim()) return;
        setEnhancing(true);
        try {
            // Call AI enhance prompt endpoint
            const response = await fetch("/api/v1/ai/enhance-prompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: data.rawInput }),
            });
            if (response.ok) {
                const result = await response.json();
                if (result.data?.enhancedPrompt) {
                    onChange({ ...data, rawInput: result.data.enhancedPrompt });
                }
            }
        } catch (err) {
            console.error("Failed to enhance prompt:", err);
        } finally {
            setEnhancing(false);
        }
    };

    const hasStoryId = Boolean(data.storyId?.trim());
    const canProceed = hasStoryId && data.rawInput.trim().length > 0 && !creating;

    return (
        <div className="space-y-5">
            {!hasStoryId && (
                <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-200">
                    Missing story. Open this wizard from a story page (needs{" "}
                    <code className="text-xs">?storyId=...</code>), or go back and create/select a story first.
                </div>
            )}

            {/* Story Direction */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Story Direction</label>
                <div className="relative">
                    <textarea
                        value={data.rawInput}
                        onChange={(e) => {
                            if (e.target.value.length <= 200) {
                                onChange({ ...data, rawInput: e.target.value });
                            }
                        }}
                        placeholder="Describe where you want the story to go..."
                        rows={4}
                        className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm pr-20"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{data.rawInput.length}/200</span>
                        <button
                            onClick={handleAIEnhance}
                            disabled={enhancing || !data.rawInput.trim()}
                            className="p-1.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 disabled:opacity-30 transition-colors"
                            title="AI Enhance"
                        >
                            {enhancing ? (
                                <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin" />
                            ) : (
                                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Comic Style */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Comic Style</label>
                {loadingStyles ? (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="shrink-0 w-20 h-8 rounded-full bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {styles.map((style) => (
                            <button
                                key={style.id}
                                onClick={() => onChange({ ...data, style: style.value })}
                                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                                    data.style === style.value
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background text-foreground border-border hover:border-primary/40"
                                }`}
                            >
                                {style.emoji && <span className="mr-1">{style.emoji}</span>}
                                {style.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Scene Count */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Scene Count</label>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => adjustSceneCount(-1)}
                        disabled={data.sceneCount <= 2}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:bg-muted"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="flex-1 h-8 bg-background border border-border flex items-center justify-center rounded-full">
                        <span className="text-sm font-bold">{data.sceneCount}</span>
                    </div>
                    <button
                        onClick={() => adjustSceneCount(1)}
                        disabled={data.sceneCount >= 8}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:bg-muted"
                    >
                        <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-muted-foreground">(2-8)</span>
                </div>
            </div>

            {/* Characters */}
            {data.characters && data.characters.length > 0 && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Characters</label>
                    <div className="flex flex-wrap gap-2">
                        {data.characters.map((char) => (
                            <div key={char.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background">
                                {char.avatar && <img src={char.avatar} alt="" className="w-5 h-5 rounded-full" />}
                                <span className="text-sm">{char.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={onBack}
                    disabled={creating}
                    className="flex-1 py-3 border border-border bg-background hover:bg-muted text-foreground font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!canProceed}
                    className="flex-1 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {creating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Wand2 className="w-4 h-4" />
                    )}
                    {creating ? "Starting..." : "Start Generation"}
                </button>
            </div>
        </div>
    );
}
