"use client";

import { useState } from "react";
import { Video, Wand2, Play, SkipForward } from "lucide-react";

interface VideoStepProps {
    data: {
        scenes: any[];
        video?: string;
    };
    onChange: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export function VideoStep({ data, onChange, onNext, onBack }: VideoStepProps) {
    const [generating, setGenerating] = useState(false);
    const [generatingSceneId, setGeneratingSceneId] = useState<string | null>(null);
    const [playingSceneId, setPlayingSceneId] = useState<string | null>(null);

    const generateVideos = async () => {
        setGenerating(true);
        // Mock video generation
        setTimeout(() => {
            const mockVideoUrls = [
                "https://sample-videos.com/video123/360p_720kb/video.mp4",
                "https://sample-videos.com/video123/360p_720kb/video2.mp4",
                "https://sample-videos.com/video123/360p_720kb/video3.mp4",
            ];
            // Update scenes with video URLs
            const updatedScenes = data.scenes.map((scene: any, index: number) => ({
                ...scene,
                videoUrl: mockVideoUrls[index],
                totalVideoDuration: 15 + Math.floor(Math.random() * 10),
                isSubdivided: Math.random() > 0.5,
            }));
            onChange({ ...data, scenes: updatedScenes });
            setGenerating(false);
        }, 2500);
    };

    const generateSceneVideo = async (sceneId: string) => {
        setGeneratingSceneId(sceneId);
        // Mock scene video generation
        setTimeout(() => {
            const mockVideoUrl = `https://sample-videos.com/video${Math.floor(Math.random() * 1000)}/360p_720kb/video.mp4`;
            // Update specific scene
            const updatedScenes = data.scenes.map((scene: any) => 
                scene.id === sceneId 
                    ? { ...scene, videoUrl: mockVideoUrl, totalVideoDuration: 15 + Math.floor(Math.random() * 10) }
                    : scene
            );
            onChange({ ...data, scenes: updatedScenes });
            setGeneratingSceneId(null);
        }, 1500);
    };

    const hasVideos = data.scenes?.some((scene: any) => scene.videoUrl);

    return (
        <div className="space-y-4">
            {/* Generate Videos Card */}
            {!hasVideos && (
                <div className="p-8 bg-background border border-border rounded-xl text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center mx-auto">
                        <Wand2 className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                        Generate Scene Videos
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        AI will create video animations for each scene using advanced generative models
                    </p>
                    <button
                        onClick={generateVideos}
                        disabled={generating}
                        className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {generating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Generating Videos...
                            </>
                        ) : (
                            <>
                                <Video className="w-4 h-4" />
                                Generate Videos
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Scenes List with Video Status */}
            {data.scenes.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-base font-semibold text-foreground">
                        Scene Videos ({data.scenes.filter((s: any) => s.videoUrl).length}/{data.scenes.length})
                    </h2>
                    {data.scenes.map((scene: any, index: number) => (
                        <div 
                            key={scene.id}
                            className="p-4 bg-background border border-border rounded-xl"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-base font-semibold text-foreground flex-1">
                                    {scene.title || `Scene ${index + 1}`}
                                </h3>
                                {scene.videoUrl ? (
                                    <div className="flex items-center gap-1.5 text-red-500">
                                        <Video className="w-3.5 h-3.5" />
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => generateSceneVideo(scene.id)}
                                        disabled={generatingSceneId === scene.id}
                                        className="text-xs text-purple-500 font-medium border border-purple-500 px-3 py-1.5 rounded-full hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {generatingSceneId === scene.id ? "Generating..." : "Generate"}
                                    </button>
                                )}
                            </div>

                            {/* Video Player (if video exists) */}
                            {scene.videoUrl && (
                                <div 
                                    className="relative rounded-lg overflow-hidden bg-black mb-2"
                                    onClick={() => setPlayingSceneId(playingSceneId === scene.id ? null : scene.id)}
                                >
                                    <video
                                        src={scene.videoUrl}
                                        className="w-full h-[200px] object-cover cursor-pointer"
                                        playsInline
                                    />
                                    {!playingSceneId && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                                <Play className="w-6 h-6 text-black ml-0.5" />
                                            </div>
                                        </div>
                                    )}
                                    {scene.totalVideoDuration && (
                                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs">
                                            {scene.totalVideoDuration}s
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Subdivided Badge */}
                            {scene.isSubdivided && scene.videoUrl && (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-xs font-medium text-blue-500">
                                        Multi-segment HLS video
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
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
                    disabled={!hasVideos}
                    className="flex-1 py-3 bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                    {hasVideos ? "Next" : "Skip"}
                </button>
            </div>
        </div>
    );
}
