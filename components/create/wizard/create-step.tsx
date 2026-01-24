"use client";

import { ArrowLeftRight, RotateCcw, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

interface CreateStepProps {
    data: {
        title: string;
        style: string;
        useAI: boolean;
        sceneCount: number;
        characters: [];
        content: string;
        generatedContent: string;
        scenes: any[];
    };
    onChange: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export function CreateStep({ data, onChange, onNext, onBack }: CreateStepProps) {
    const [showFullContent, setShowFullContent] = useState(false);
    const [generatingScenes, setGeneratingScenes] = useState(false);

    const generateSceneDescriptions = async () => {
        setGeneratingScenes(true);
        // Mock AI generation
        setTimeout(() => {
            const mockScenes = [
                {
                    id: "1",
                    sequence: 1,
                    title: "Opening Scene",
                    description: "The story begins with an engaging introduction to the world and characters."
                },
                {
                    id: "2", 
                    sequence: 2,
                    title: "Rising Action",
                    description: "Tensions build as the protagonist faces their first challenge."
                },
                {
                    id: "3",
                    sequence: 3,
                    title: "The Climax",
                    description: "All plot threads converge in this pivotal moment."
                }
            ];
            onChange({ ...data, scenes: mockScenes });
            setGeneratingScenes(false);
        }, 2000);
    };

    const regenerateAll = () => {
        onChange({ ...data, scenes: [] });
    };

    return (
        <div className="space-y-4">
            {/* Content Preview Card */}
            <div className="p-4 bg-background border border-border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">
                            Chapter Content
                        </h3>
                    </div>
                    {data.useAI && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50">
                            <span className="text-xs">✨</span>
                            <span className="text-xs font-medium text-purple-600">AI Generated</span>
                        </div>
                    )}
                </div>
                <hr className="my-3 border-border/50" />
                <h4 className="text-base font-bold text-foreground mb-2">{data.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.generatedContent || data.content}
                </p>
            </div>

            {/* Generate Scenes Card */}
            {data.useAI && data.scenes.length === 0 && (
                <div className="p-6 bg-background border border-border rounded-xl">
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                            <ArrowLeftRight className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                            Break Down into Scenes
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            AI will analyze the chapter and break it into {data.sceneCount} distinct scenes
                        </p>
                        <button
                            onClick={generateSceneDescriptions}
                            disabled={generatingScenes}
                            className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {generatingScenes ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <ArrowLeftRight className="w-4 h-4" />
                            )}
                            {generatingScenes ? "Generating..." : "Render Scenes"}
                        </button>
                    </div>
                </div>
            )}

            {/* Scenes Tab Content */}
            {data.scenes.length > 0 && (
                <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-muted-foreground">
                                Chapter Context
                            </h4>
                        </div>
                        <div className="relative">
                            <p className={`text-sm text-muted-foreground leading-relaxed ${!showFullContent ? "line-clamp-3" : ""}`}>
                                {data.generatedContent || data.content}
                            </p>
                            {(data.generatedContent || data.content).length > 150 && (
                                <button
                                    onClick={() => setShowFullContent(!showFullContent)}
                                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-background shadow-md flex items-center justify-center hover:bg-gray-100"
                                >
                                    {showFullContent ? (
                                        <ChevronUp className="w-3.5 h-3.5 text-blue-500" />
                                    ) : (
                                        <ChevronDown className="w-3.5 h-3.5 text-blue-500 rotate-90" />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={generateSceneDescriptions}
                            disabled={generatingScenes}
                            className="flex-1 py-2.5 border border-border bg-background hover:bg-muted text-foreground text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Regenerate
                        </button>
                        <button
                            onClick={onNext}
                            className="flex-1 py-2.5 border border-primary bg-background text-primary text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-1.5"
                        >
                            Accept & Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Back Button */}
            <button
                onClick={onBack}
                className="w-full py-3 border border-border bg-background hover:bg-muted text-foreground font-medium rounded-lg transition-colors"
            >
                Back
            </button>
        </div>
    );
}
