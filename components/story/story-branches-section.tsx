"use client";

import { Storyboard } from "@/lib/types";
import { StoryboardCard } from "@/components/storyboard/storyboard-card";
import { EmptyStoryboards } from "./empty-storyboards";

interface StoryBranchesSectionProps {
    storyId: string;
    storyTitle: string;
    storyboards: Storyboard[];
    isLoading: boolean;
    onStoryboardTap: (storyboard: Storyboard) => void;
}

export function StoryBranchesSection({ 
    storyId, 
    storyTitle,
    storyboards, 
    isLoading, 
    onStoryboardTap 
}: StoryBranchesSectionProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <p className="text-sm text-muted-foreground mt-3">Loading storyboards...</p>
            </div>
        );
    }

    if (storyboards.length === 0) {
        return <EmptyStoryboards storyTitle={storyTitle} />;
    }

    return (
        <div className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">
                Story Branches
            </h2>
            {Array.isArray(storyboards) && storyboards.map((storyboard) => (
                <StoryboardCard
                    key={storyboard.id}
                    storyboard={storyboard}
                    onTap={() => onStoryboardTap(storyboard)}
                />
            ))}
        </div>
    );
}
