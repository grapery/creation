"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Storyboard } from "@/lib/types";
import { profile } from "@/lib/api/profile";
import { Loader2, ArrowLeft, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileDraftsPage() {
    const router = useRouter();
    const [drafts, setDrafts] = useState<Storyboard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const data = await profile.getDrafts(1, 50);
                setDrafts(data.drafts || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleDeleteDraft = async (id: string) => {
        try {
            await profile.deleteDraft(id);
            setDrafts(drafts.filter((d) => d.id !== id));
        } catch (e) {
            console.error("Failed to delete draft:", e);
        }
    };

    const handleResumeDraft = (draft: Storyboard) => {
        // Navigate to editor with draft data
        router.push(`/create?draftId=${draft.id}`);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <h1 className="text-lg font-bold text-foreground">Drafts</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-4 max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : drafts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Sparkles className="w-12 h-12 text-muted-foreground/50 mb-4" />
                        <p className="text-lg font-semibold text-foreground mb-2">No drafts yet</p>
                        <p className="text-sm text-muted-foreground">
                            Start creating and save your drafts here
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {drafts.map((draft) => (
                            <Card key={draft.id} className="overflow-hidden hover:shadow-md transition-shadow relative">
                                <CardContent className="p-4">
                                    <div
                                        onClick={() => handleResumeDraft(draft)}
                                        className="cursor-pointer"
                                    >
                                        {/* Cover Image */}
                                        {draft.image && (
                                            <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-secondary">
                                                <img
                                                    src={draft.image}
                                                    alt={draft.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Title */}
                                        <h3 className="text-base font-bold text-foreground mb-1 line-clamp-2">
                                            {draft.title}
                                        </h3>

                                        {/* Description */}
                                        {draft.content && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                {draft.content}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{draft.storyboardScenes?.length || 0} scenes</span>
                                            <span className="text-[11px] text-muted-foreground">
                                                {draft.createdAt && new Date(draft.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteDraft(draft.id);
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3 text-muted-foreground" />
                                    </button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
