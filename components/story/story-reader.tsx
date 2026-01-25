"use client";

import { Story, Storyboard, StoryboardScene, Character as CharacterType } from "@/lib/types";
import { X, ChevronLeft, ChevronRight, BookOpen, Users, Image as ImageIcon } from "lucide-react";

interface StoryReaderContent {
    storyboardId: string;
    storyId: string;
    parentId?: string;
    groupId?: string | null;
    backgroundImageURL?: string;
    title: string;
    summary: string;
    authorName: string;
    authorAvatar?: string;
    publishDate: Date;
    likes: number;
    comments: number;
    shares: number;
    forks: number;
    isStandalone: boolean;
    isAIGenerated: boolean;
    isLiked: boolean;
    characters: Array<{
        id: string;
        name: string;
        avatar: string;
    }>;
    scenes: Array<{
        id: string;
        title: string;
        imageUrl?: string;
        videoUrl?: string;
    }>;
}

interface StoryReaderProps {
    content: StoryReaderContent;
    onClose: () => void;
    onFork: (storyboardId: string) => void;
    onLike: () => void;
    onBranchTap: (index: number) => void;
}

export function StoryReader({ content, onClose, onFork, onLike, onBranchTap }: StoryReaderProps) {
    const [currentBranchIndex, setCurrentBranchIndex] = useState(0);

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card">
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-foreground" />
                </button>

                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                        {content.characters.length} Characters
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="relative min-h-screen">
                    {/* Background Image */}
                    {content.backgroundImageURL && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src={content.backgroundImageURL}
                                alt="Background"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="relative z-10 max-w-3xl mx-auto p-6">
                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-6 text-shadow-lg">
                            {content.title}
                        </h1>

                        {/* Author Info */}
                        {content.authorName && (
                            <div className="flex items-center justify-center gap-3 mb-6">
                                {content.authorAvatar ? (
                                    <img
                                        src={content.authorAvatar}
                                        alt={content.authorName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                        <span className="text-white font-bold">
                                            {content.authorName.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div className="text-sm text-foreground">
                                    <span className="font-medium">{content.authorName}</span>
                                    <span className="text-muted-foreground mx-1">•</span>
                                    <span className="text-muted-foreground">
                                        {content.publishDate.toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        {content.summary && (
                            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-border/50">
                                <p className="text-base text-foreground leading-relaxed">
                                    {content.summary}
                                </p>
                            </div>
                        )}

                        {/* Characters */}
                        {content.characters.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-foreground mb-4">
                                    Characters
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {content.characters.map((char, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-3 bg-card border border-border/50 rounded-full p-2"
                                        >
                                            {char.avatar ? (
                                                <img
                                                    src={char.avatar}
                                                    alt={char.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">
                                                        {char.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="text-sm font-medium text-foreground">
                                                {char.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        )}

                        {/* Scenes */}
                        {content.scenes.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-foreground mb-4">
                                    Scenes
                                </h2>
                                <div className="space-y-4">
                                    {content.scenes.map((scene, idx) => (
                                        <div
                                            key={idx}
                                            className="relative bg-card border border-border/50 rounded-xl overflow-hidden"
                                        >
                                            {scene.imageUrl && (
                                                <img
                                                    src={scene.imageUrl}
                                                    alt={scene.title}
                                                    className="w-full aspect-video object-cover"
                                                />
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                                                <p className="text-white text-sm font-medium">
                                                    {scene.title}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border/50 bg-card">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <button
                        onClick={onLike}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors"
                    >
                        <span className="text-sm font-medium">
                            {content.isLiked ? "Liked" : "Like"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {content.likes}
                        </span>
                    </button>

                    <div className="flex-1" />

                    <button
                        onClick={() => onBranchTap(currentBranchIndex)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            Previous Branch
                        </span>
                    </button>

                    <span className="text-xs text-muted-foreground">
                        {currentBranchIndex + 1} / 1
                    </span>

                    <button
                        onClick={() => onBranchTap(currentBranchIndex + 1)}
                        disabled={currentBranchIndex >= content.scenes.length - 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted disabled:opacity-50 transition-colors"
                    >
                        <span className="text-sm font-medium">
                            Next Branch
                        </span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
