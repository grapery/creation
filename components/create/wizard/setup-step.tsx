"use client";

import { useState } from "react";
import { Character, StoryScene } from "@/lib/types";
import { Wand2, Plus, ArrowLeftRight, ChevronDown, ChevronUp } from "lucide-react";

interface SetupStepProps {
    data: {
        title: string;
        style: string;
        useAI: boolean;
        sceneCount: number;
        characters: Character[];
        content: string;
        generatedContent: string;
    };
    onChange: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export function SetupStep({ data, onChange, onNext, onBack }: SetupStepProps) {
    const [showFullContent, setShowFullContent] = useState(false);
    const [generatedContent, setGeneratedContent] = useState("");

    const canRenderStory = data.title.length > 0 && data.content.length > 0;
    const canCreateStoryboard = data.useAI
        ? generatedContent.length > 0 || (data.title.length > 0 && data.content.length > 0)
        : data.title.length > 0 && data.content.length > 0;

    const toggleAI = () => {
        onChange({ ...data, useAI: !data.useAI });
    };

    const adjustSceneCount = (delta: number) => {
        const newCount = Math.max(2, Math.min(5, data.sceneCount + delta));
        onChange({ ...data, sceneCount: newCount });
    };

    const renderContent = async () => {
        // Mock AI content generation
        const content = `Chapter 1: ${data.title}\n\nScene 1: The Beginning\n${data.content}\n\nScene 2: Rising Action\nAs the plot thickens, new challenges emerge for our characters...\n\nScene 3: The Climax\nEverything comes to a head in this pivotal moment.\n\nScene ${data.sceneCount}: Resolution\nThe story concludes with meaningful closure.`;
        setGeneratedContent(content);
        // Update parent component data to enable the "Continue" button
        onChange({ ...data, generatedContent: content });
    };

    return (
        <div className="space-y-4">
            {/* Title with AI Toggle */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                    Title
                </label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => onChange({ ...data, title: e.target.value })}
                    placeholder="Enter story title"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                    Description
                </label>
                <textarea
                    value={data.content}
                    onChange={(e) => onChange({ ...data, content: e.target.value })}
                    placeholder="Describe your chapter..."
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
            </div>

            {/* AI Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                    <Wand2 className="w-5 h-5 text-purple-500" />
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Use AI Generation
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Let AI generate scenes and content
                        </p>
                    </div>
                </div>
                <button
                    onClick={toggleAI}
                    className={`relative w-11 h-6 rounded-full transition-colors ${data.useAI ? "bg-purple-500" : "bg-gray-300"
                        }`}
                >
                    <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${data.useAI ? "translate-x-5" : "translate-x-1"
                            }`}
                    />
                </button>
            </div>

            {/* Scene Count Picker - Only shown when AI is enabled */}
            {data.useAI && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        Number of Scenes
                    </label>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => adjustSceneCount(-1)}
                            disabled={data.sceneCount <= 2}
                            className="w-7 h-7 rounded-full border border-gradient-to-br from-purple-400/60 to-blue-400/60 flex items-center justify-center disabled:opacity-50"
                        >
                            <ChevronDown className="w-3 h-3" />
                        </button>
                        <div className="flex-1 h-7 bg-background border border-gradient-to-br from-purple-400/60 to-blue-400/60 flex items-center justify-center rounded-full">
                            <span className="text-sm font-semibold">
                                {data.sceneCount}
                            </span>
                        </div>
                        <button
                            onClick={() => adjustSceneCount(1)}
                            disabled={data.sceneCount >= 5}
                            className="w-7 h-7 rounded-full border border-gradient-to-br from-purple-400/60 to-blue-400/60 flex items-center justify-center disabled:opacity-50"
                        >
                            <ChevronUp className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}

            {/* AI Generated Content Preview */}
            {data.useAI && generatedContent.length > 0 && (
                <div className="p-4 bg-green-50/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                                AI Content Generated
                            </span>
                        </div>
                        <button
                            onClick={() => setGeneratedContent("")}
                            className="text-xs text-blue-500 border border-blue-500 px-2 py-1 rounded-full hover:bg-blue-50"
                        >
                            Re-render
                        </button>
                    </div>
                    <div className="relative">
                        <p className={`text-sm text-muted-foreground leading-relaxed ${!showFullContent ? "line-clamp-5" : ""}`}>
                            {generatedContent}
                        </p>
                        {generatedContent.length > 200 && (
                            <button
                                onClick={() => setShowFullContent(!showFullContent)}
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-background shadow-md flex items-center justify-center hover:bg-gray-100"
                            >
                                {showFullContent ? (
                                    <ChevronUp className="w-4 h-4 text-blue-500" />
                                ) : (
                                    <ArrowLeftRight className="w-4 h-4 text-blue-500 rotate-90" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Render Story Button - AI Mode */}
            {data.useAI && generatedContent.length === 0 && (
                <button
                    onClick={renderContent}
                    disabled={!canRenderStory}
                    className="w-full py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <Wand2 className="w-4 h-4" />
                    Render Story
                </button>
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
                    disabled={!canCreateStoryboard}
                    className="flex-1 py-3 bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                    {data.useAI && generatedContent.length > 0 ? "Create Storyboard" : "Continue"}
                </button>
            </div>
        </div>
    );
}
