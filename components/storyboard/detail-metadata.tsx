"use client";

import { User as UserIcon, Calendar, Grid2x2, CheckCircle } from "lucide-react";
import { Storyboard, StoryboardWorkflow } from "@/lib/types";

interface DetailMetadataProps {
    storyboard: Storyboard;
    workflow?: StoryboardWorkflow;
}

// ... imports
import { useTranslation } from "@/providers/language-provider";

interface DetailMetadataProps {
    storyboard: Storyboard;
    workflow?: StoryboardWorkflow;
}

export function DetailMetadata({ storyboard, workflow }: DetailMetadataProps) {
    const { t } = useTranslation();
    const formatDate = (timestamp?: number) => {
        if (!timestamp) return "Unknown";
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
                {t("storyboard_detail.additional_details")}
            </h2>

            <div className="p-4 bg-background border border-border rounded-[12px] space-y-3">
                {/* Creator */}
                <div className="flex items-center gap-3">
                    <UserIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground w-20">{t("storyboard_detail.creator")}</span>
                    <span className="text-sm font-medium text-foreground">
                        {storyboard.creatorName || "Unknown"}
                    </span>
                    <div className="flex-1" />
                </div>

                {/* Created At */}
                <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground w-20">{t("storyboard_detail.created")}</span>
                    <span className="text-sm font-medium text-foreground">
                        {formatDate(storyboard.createdAt)}
                    </span>
                    <div className="flex-1" />
                </div>

                {/* Scene Count */}
                {storyboard.storyboardScenes && (
                    <div className="flex items-center gap-3">
                        <Grid2x2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground w-20">{t("storyboard_detail.scenes")}</span>
                        <span className="text-sm font-medium text-foreground">
                            {storyboard.storyboardScenes.length}
                        </span>
                        <div className="flex-1" />
                    </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground w-20">{t("storyboard_detail.status")}</span>
                    <span className="text-sm font-medium text-foreground">
                        {workflow?.workflowStatus || t("storyboard_detail.status_completed")}
                    </span>
                    <div className="flex-1" />
                </div>
            </div>

            {/* Token Consumption Badge */}
            {workflow?.tokenConsumption && workflow.tokenConsumption > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50/10 rounded-full self-start">
                    <span className="text-[12px] text-orange-500 font-semibold">⚡</span>
                    <span className="text-[12px] font-medium text-muted-foreground">
                        {workflow.tokenConsumption} {t("storyboard_detail.tokens")}
                    </span>
                </div>
            )}
        </div>
    );
}
