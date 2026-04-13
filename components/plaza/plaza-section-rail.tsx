"use client";

import { useRouter } from "next/navigation";
import { PlazaSectionHeader } from "./plaza-section-header";
import { FragmentCard } from "@/components/fragment/fragment-card";
import type { PlazaSection } from "@/lib/types";
import { Heart } from "lucide-react";

interface PlazaSectionRailProps {
    section: PlazaSection;
}

export function PlazaSectionRail({ section }: PlazaSectionRailProps) {
    const router = useRouter();

    const handleSeeAll = () => {
        // Navigate to section detail page
        router.push(`/plaza/section/${section.id}`);
    };

    return (
        <div className="space-y-2">
            <PlazaSectionHeader section={section} onSeeAll={handleSeeAll} />

            {/* Horizontal scroll rail */}
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                {/* Fragment items */}
                {section.fragments?.map((fragment) => (
                    <div key={fragment.id} className="shrink-0 w-[120px]">
                        <FragmentCard fragment={fragment} compact />
                    </div>
                ))}

                {/* Story items */}
                {section.stories?.map((story) => (
                    <button
                        key={story.id}
                        onClick={() => router.push(`/stories/${story.id}`)}
                        className="shrink-0 w-[130px] group"
                    >
                        <div className="relative rounded-xl overflow-hidden h-[180px] bg-muted">
                            {story.coverURL ? (
                                <img
                                    src={story.coverURL}
                                    alt={story.title || ""}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground">{story.title}</span>
                                </div>
                            )}
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            {/* Title */}
                            <div className="absolute bottom-0 left-0 right-0 p-2">
                                <p className="text-white text-xs font-medium line-clamp-1">{story.title}</p>
                                {story.likes != null && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Heart className="w-3 h-3 text-white/70" />
                                        <span className="text-white/70 text-[10px]">{story.likes}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
