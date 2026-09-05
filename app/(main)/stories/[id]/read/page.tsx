"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { stories } from "@/lib/api/stories";
import { storyboards } from "@/lib/api/storyboards";
import { Storyboard, StoryboardScene } from "@/lib/types";
import { Loader2, ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseShareGrant } from "@/lib/share-grant";

/**
 * Immersive story reader — loads the first (or ?board=) storyboard scenes
 * and presents them full-viewport, matching Voyager's lighter StoryReader path.
 */
export default function StoryReadPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const shareGrant = useMemo(() => parseShareGrant(searchParams), [searchParams]);
    const boardIdParam = searchParams.get("board");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [board, setBoard] = useState<Storyboard | null>(null);
    const [scenes, setScenes] = useState<StoryboardScene[]>([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const story = await stories.get(id, shareGrant);
                if (cancelled) return;
                setTitle(story.title || "Story");

                let targetId = boardIdParam || "";
                if (!targetId) {
                    const list = await storyboards.getByStoryId(id, null, 1, 20);
                    targetId = list.storyboards?.[0]?.id || "";
                }
                if (!targetId) {
                    setError("No storyboards to read yet");
                    return;
                }
                const data = await storyboards.get(targetId, shareGrant);
                if (cancelled) return;
                setBoard(data);
                const sceneList = (data.storyboardScenes || []) as StoryboardScene[];
                setScenes(sceneList);
                setIndex(0);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load reader");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [id, boardIdParam, shareGrant]);

    const go = useCallback(
        (delta: number) => {
            setIndex((i) => Math.max(0, Math.min(scenes.length - 1, i + delta)));
        },
        [scenes.length]
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === " ") {
                e.preventDefault();
                go(1);
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                go(-1);
            } else if (e.key === "Escape") {
                router.push(`/stories/${id}`);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [go, router, id]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    if (error || !board) {
        return (
            <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-4 p-6">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">{error || "Nothing to read"}</p>
                <Button onClick={() => router.push(`/stories/${id}`)}>Back to story</Button>
            </div>
        );
    }

    const scene = scenes[index];
    const image =
        scene?.image ||
        (scene as { videoCoverUrl?: string })?.videoCoverUrl ||
        board.image;

    return (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] bg-black/60 absolute top-0 inset-x-0 z-10">
                <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{title}</p>
                    <p className="text-xs text-white/60 truncate">{board.title}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={() => router.push(`/stories/${id}`)}
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div
                className="flex-1 flex items-center justify-center relative cursor-pointer"
                onClick={(e) => {
                    const mid = e.currentTarget.clientWidth / 2;
                    go(e.clientX > mid ? 1 : -1);
                }}
            >
                {image ? (
                    <Image src={image} alt="" priority width={0} height={0} className="object-contain" style={{ width: "100%", height: "100%", maxHeight: "100%", maxWidth: "100%" }} sizes="100vw" />
                ) : (
                    <div className="px-8 text-center space-y-3 max-w-lg">
                        <p className="text-lg font-semibold">{scene?.title || `Scene ${index + 1}`}</p>
                        <p className="text-sm text-white/80 whitespace-pre-wrap">
                            {(scene as { content?: string; description?: string })?.content || (scene as { content?: string; description?: string })?.description || board.content || "No scene media"}
                        </p>
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 inset-x-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-black/80 to-transparent">
                {scene && (
                    <div className="mb-3 max-w-2xl mx-auto text-center">
                        {scene.title && <p className="text-sm font-medium">{scene.title}</p>}
                        {(scene as { content?: string }).content && (
                            <p className="text-xs text-white/70 line-clamp-3 mt-1">{(scene as { content?: string }).content}</p>
                        )}
                    </div>
                )}
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white"
                        disabled={index <= 0}
                        onClick={(e) => {
                            e.stopPropagation();
                            go(-1);
                        }}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <span className="text-sm text-white/80 tabular-nums">
                        {scenes.length ? index + 1 : 0} / {scenes.length}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white"
                        disabled={index >= scenes.length - 1}
                        onClick={(e) => {
                            e.stopPropagation();
                            go(1);
                        }}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="ml-2"
                        onClick={() => router.push(`/storyboards/${board.id}`)}
                    >
                        Full detail
                    </Button>
                </div>
            </div>
        </div>
    );
}
