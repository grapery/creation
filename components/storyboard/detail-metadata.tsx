"use client";

import { User as UserIcon, Calendar, Clock, SquareGrid2x2, CheckCircle } from "lucide-react";
import { Storyboard, StoryboardWorkflow } from "@/lib/types";

interface DetailMetadataProps {
    storyboard: Storyboard;
    workflow?: StoryboardWorkflow;
}

export function DetailMetadata({ storyboard, workflow }: DetailMetadataProps) {
    const formatDate = (timestamp?: number) => {
        if (!timestamp) return "Unknown";
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
                Additional Details
            </h2>
            
            <div className="p-4 bg-background border border-border rounded-[12px] space-y-3">
                {/* Creator */}
                <div className="flex items-center gap-3">
                    <UserIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground w-20">Creator</span>
                    <span className="text-sm font-medium text-foreground">
                        {storyboard.creatorName || "Unknown"}
                    </span>
                    <div className="flex-1" />
                </div>

                {/* Created At */}
                <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground w-20">Created</span>
                    <span className="text-sm font-medium text-foreground">
                        {formatDate(storyboard.createdAt)}
                    </span>
                    <div className="flex-1" />
                </div>

                {/* Updated At */}
                <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground w-20">Updated</span>
                    <span className="text-sm font-medium text-foreground">
                        {formatDate(storyboard.updatedAt)}
                    </span>
                    <div className="flex-1" />
                </div>

                {/* Scene Count */}
                {storyboard.storyboardScenes && (
                    <div className="flex items-center gap-3">
                        <SquareGrid2x2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground w-20">Scenes</span>
                        <span className="text-sm font-medium text-foreground">
                            {storyboard.storyboardScenes.length}
                        </span>
                        <div className="flex-1" />
                    </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground w-20">Status</span>
                    <span className="text-sm font-medium text-foreground">
                        {workflow?.workflowStatus || "Completed"}
                    </span>
                    <div className="flex-1" />
                </div>
            </div>

            {/* Token Consumption Badge */}
            {workflow?.tokenConsumption && workflow.tokenConsumption > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50/10 rounded-full self-start">
                    <span className="text-[12px] text-orange-500 font-semibold">⚡</span>
                    <span className="text-[12px] font-medium text-muted-foreground">
                        {workflow.tokenConsumption} tokens
                    </span>
                </div>
            )}
        </div>
    );
}
