"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Sparkles, TrendingUp } from "lucide-react";
import { storyboards } from "@/lib/api/storyboards";
import { stories } from "@/lib/api/stories";
import { StoryboardCard } from "@/components/storyboard/storyboard-card";
import type { Storyboard, Story } from "@/lib/types";
import { useLoginPrompt } from "@/components/auth/login-prompt";
import { Button } from "@/components/ui/button";

/**
 * Guest-safe Discover feed aligned with iOS Voyager:
 * public trending storyboards / stories + optional-auth community feed.
 * Does not call auth-only /api/v1/plaza.
 */
export function GuestDiscoverFeed() {
    const [boards, setBoards] = useState<Storyboard[]>([]);
    const [trendingStories, setTrendingStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const { LoginPromptModal, show: showLoginPrompt } = useLoginPrompt();

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const [trendingBoards, feed, trending] = await Promise.all([
                    storyboards.getTrending(1, 20).catch(() => ({ storyboards: [] as Storyboard[] })),
                    storyboards.getFeed(1, 20).catch(() => ({ storyboards: [] as Storyboard[] })),
                    stories.getTrending(12).catch(() => ({ stories: [] as Story[] })),
                ]);
                if (cancelled) return;

                const fromTrending = trendingBoards.storyboards || [];
                const fromFeed = feed.storyboards || [];
                // Prefer public trending; fill with discover feed if thin
                const merged = fromTrending.length > 0 ? fromTrending : fromFeed;
                const seen = new Set(merged.map((b) => b.id));
                for (const b of fromFeed) {
                    if (!seen.has(b.id)) {
                        merged.push(b);
                        seen.add(b.id);
                    }
                }
                setBoards(merged);
                setTrendingStories(trending.stories || []);
            } catch (e) {
                console.error("Failed to load guest discover feed:", e);
                if (!cancelled) {
                    setBoards([]);
                    setTrendingStories([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Discover</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Browse trending stories and storyboards — sign in to create, follow, and like.
                    </p>
                </div>
                <Button onClick={() => showLoginPrompt()} variant="default">
                    Sign in
                </Button>
            </div>

            <div className="flex flex-wrap gap-3">
                <Link
                    href="/fragments"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm hover:bg-muted"
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    Fragments
                </Link>
                <Link
                    href="/plaza"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-sm hover:bg-muted"
                >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Plaza
                </Link>
            </div>

            {trendingStories.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Trending stories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {trendingStories.map((story) => (
                            <Link key={story.id} href={`/stories/${story.id}`} className="block group">
                                <div className="rounded-xl overflow-hidden border border-border bg-card transition-all hover:shadow-md hover:border-primary/30">
                                    {story.coverImage ? (
                                        <div className="aspect-[3/4] overflow-hidden">
                                            <Image src={story.coverImage} alt={story.title} width={0} height={0} className="w-full h-full object-cover transition-transform group-hover:scale-105" style={{ width: "100%", height: "100%" }} sizes="100vw" />
                                        </div>
                                    ) : (
                                        <div className="aspect-[3/4] bg-muted flex items-center justify-center p-3">
                                            <p className="text-sm text-muted-foreground text-center line-clamp-3">
                                                {story.title}
                                            </p>
                                        </div>
                                    )}
                                    <div className="p-3">
                                        <p className="text-sm font-medium line-clamp-2">{story.title}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Storyboards</h2>
                {boards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                        <Sparkles className="h-10 w-10 text-muted-foreground" />
                        <p className="text-muted-foreground">No public content yet.</p>
                        <Button variant="outline" onClick={() => showLoginPrompt()}>
                            Sign in to explore more
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {boards.map((board) => (
                            <StoryboardCard key={board.id} storyboard={board} />
                        ))}
                    </div>
                )}
            </section>

            <LoginPromptModal
                title="Sign in to continue"
                description="Create, follow, like, and search require an account."
            />
        </div>
    );
}
