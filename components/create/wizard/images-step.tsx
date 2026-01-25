"use client";

import { useState } from "react";
import { Image as ImageIcon, Wand2, RefreshCw, SkipForward } from "lucide-react";

interface ImagesStepProps {
    data: {
        scenes: any[];
        images?: string[];
    };
    onChange: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export function ImagesStep({ data, onChange, onNext, onBack }: ImagesStepProps) {
    const [generating, setGenerating] = useState(false);
    const [generatingSceneId, setGeneratingSceneId] = useState<string | null>(null);

    const generateImages = async () => {
        setGenerating(true);
        // Mock image generation
        setTimeout(() => {
            const mockImages = [
                "https://images.unsplash.com/photo-1544716279-ca5e3f4abd8c?w=400",
                "https://images.unsplash.com/photo-15187092688082-2e5c8d0c3b9?w=400",
                "https://images.unsplash.com/photo-1534998052134-364b6257462c?w=400",
            ];
            onChange({ ...data, images: mockImages });
            setGenerating(false);
        }, 2000);
    };

    const generateSceneImage = async (sceneId: string) => {
        setGeneratingSceneId(sceneId);
        // Mock scene image generation
        setTimeout(() => {
            const mockImage = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 100000000)}?w=400`;
            // Update scene with new image
            const updatedScenes = data.scenes.map((scene: any) => 
                scene.id === sceneId ? { ...scene, image: mockImage } : scene
            );
            onChange({ ...data, scenes: updatedScenes });
            setGeneratingSceneId(null);
        }, 1500);
    };

    const regenerateAll = async () => {
        setGenerating(true);
        setTimeout(() => {
            const mockImages = [
                "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
                "https://images.unsplash.com/photo-1516339921822-447e038a1e3?w=400",
                "https://images.unsplash.com/photo-1476602775248-537d0f8136c?w=400",
            ];
            onChange({ ...data, images: mockImages });
            setGenerating(false);
        }, 2000);
    };

    const images = data.images || [];

    return (
        <div className="space-y-4">
            {/* Generate Images Card */}
            {images.length === 0 ? (
                <div className="p-8 bg-background border border-border rounded-xl text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center mx-auto">
                        <Wand2 className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                        Generate Scene Images
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        AI will create visual representations for each scene based on your descriptions
                    </p>
                    <button
                        onClick={generateImages}
                        disabled={generating}
                        className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {generating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Generating Images...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4" />
                                Generate Images
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Images Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.map((imageUrl, index) => (
                            <div 
                                key={index}
                                className="relative rounded-lg overflow-hidden border border-border bg-muted"
                            >
                                <img 
                                    src={imageUrl} 
                                    alt={`Scene ${index + 1}`}
                                    className="w-full h-[200px] object-cover"
                                />
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-md backdrop-blur-sm">
                                    <span className="text-white text-xs font-medium">
                                        Scene {index + 1}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Regenerate Button */}
                    <button
                        onClick={regenerateAll}
                        disabled={generating}
                        className="w-full py-2.5 border border-border bg-background hover:bg-muted text-foreground font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={images.length === 0}
                    className="flex-1 py-3 bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                    {images.length === 0 ? "Skip" : "Next"}
                </button>
            </div>
        </div>
    );
}
