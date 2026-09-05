"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { plaza } from "@/lib/api/plaza";
import { fragments } from "@/lib/api/fragments";
import { FragmentCard } from "@/components/fragment/fragment-card";
import StoryCardV2 from "@/components/story/story-card-v2";
import type { PlazaSection, StoryFragment, Story } from "@/lib/types";

export default function PlazaSectionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const sectionId = params.id as string;

    const [section, setSection] = useState<PlazaSection | null>(null);
    const [items, setItems] = useState<unknown[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        loadSection();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅在板块变化时重载；loadSection 为普通函数
    }, [sectionId]);

    const loadSection = async () => {
        try {
            const res = await plaza.getSections();
            const found = res.sections?.find(s => s.id === sectionId);
            if (found) {
                setSection(found);
                // Use inline data first
                const inlineItems = found.fragments || found.stories || [];
                setItems(inlineItems);
                setHasMore(inlineItems.length >= 20);
            }
        } catch (err) {
            console.error("Failed to load section:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (!section) return;
        try {
            const newOffset = offset + 20;
            if (section.kind === "fragments_topic" && section.topicTag) {
                const res = await fragments.getByTopic(section.topicTag, 20, newOffset);
                setItems(prev => [...prev, ...res.fragments]);
                setHasMore(res.fragments.length >= 20);
            } else if (section.kind === "fragments_discover_global") {
                const res = await fragments.list({ tab: "discover", limit: 20, offset: newOffset });
                setItems(prev => [...prev, ...res.fragments]);
                setHasMore(res.fragments.length >= 20);
            }
            setOffset(newOffset);
        } catch (err) {
            console.error("Failed to load more:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!section) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-lg font-semibold mb-2">Section not found</p>
                <button onClick={() => router.push("/plaza")} className="text-primary hover:underline">
                    Back to Plaza
                </button>
            </div>
        );
    }

    const isFragmentKind = section.kind.startsWith("fragments");

    return (
        <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
            {/* Back */}
            <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Plaza
            </button>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">{section.title || section.titleKey}</h1>
                {section.subtitle && <p className="text-muted-foreground text-sm mt-1">{section.subtitle}</p>}
            </div>

            {/* Grid */}
            <div className={isFragmentKind
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            }>
                {items.map((item, i) =>
                    isFragmentKind ? (
                        <FragmentCard key={i} fragment={item as StoryFragment} compact />
                    ) : (
                        <StoryCardV2 key={i} story={item as Story} />
                    )
                )}
            </div>

            {/* Load more */}
            {hasMore && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={loadMore}
                        className="px-6 py-2.5 border border-border bg-background hover:bg-muted text-foreground rounded-lg text-sm font-medium"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
