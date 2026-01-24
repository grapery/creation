"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { storyboards } from "@/lib/api/storyboards";
import { Storyboard } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { CommentList } from "@/components/comments/comment-list";
import { StoryboardRoadmap } from "@/components/storyboard/roadmap";
import { DetailMetadata } from "@/components/storyboard/detail-metadata";

export default function StoryboardPage() {
    const { id } = useParams();
    const [item, setItem] = useState<Storyboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [workflow, setWorkflow] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        async function load() {
            try {
                const data = await storyboards.get(id as string);
                setItem(data);
                // Mock workflow data - in real implementation, fetch from API
                if (data.storyboardScenes) {
                    setWorkflow({
                        rawInput: data.content,
                        content: data.content,
                        scenes: data.storyboardScenes,
                        workflowStatus: "completed",
                        tokenConsumption: 1250,
                        isAIGenerated: data.isAIGenerated || false,
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="animate-spin" />
        </div>
    );
    
    if (!item) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div>Not Found</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container px-4 py-8 max-w-4xl mx-auto">
                {/* Content Section */}
                <div className="mb-8">
                    {/* Title and Creator */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>By {item.creatorName || item.author || "Unknown"}</span>
                            {item.createdAt && (
                                <>
                                    <span>•</span>
                                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                </>
                            )}
                            {item.isAIGenerated && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-purple-500">
                                        <span className="text-xs">✨</span>
                                        AI Generated
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    {item.content && (
                        <div className="prose dark:prose-invert max-w-none leading-relaxed text-lg mb-6">
                            <p className="whitespace-pre-wrap">{item.content}</p>
                        </div>
                    )}
                </div>

                {/* Roadmap Timeline for AI Generated Storyboards */}
                {item.isAIGenerated && workflow && (
                    <div className="mb-8">
                        <StoryboardRoadmap storyboard={item} />
                    </div>
                )}

                {/* Additional Details */}
                <div className="mb-8">
                    <DetailMetadata storyboard={item} workflow={workflow} />
                </div>

                {/* Comments Section */}
                <div className="max-w-prose mx-auto mt-12 border-t pt-8">
                    <CommentList targetId={id as string} targetType="storyboard" />
                </div>
            </main>
        </div>
    );
}
