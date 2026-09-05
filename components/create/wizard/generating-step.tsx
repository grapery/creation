"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Loader2, CheckCircle, XCircle, RotateCcw, X } from "lucide-react";
import { PipelineDetail } from "./pipeline-detail";
import type { StoryboardGenerationProgress } from "@/lib/types";

interface GeneratingStepProps {
    progress: StoryboardGenerationProgress | null;
    isPolling: boolean;
    error?: string | null;
    onRetryFailedImages?: () => void;
    onCancel?: () => void;
    onComplete?: () => void;
    backgroundImage?: string;
}

export function GeneratingStep({
    progress,
    isPolling: _isPolling,
    error,
    onRetryFailedImages,
    onCancel,
    onComplete,
    backgroundImage,
}: GeneratingStepProps) {
    const workflowStatus = progress?.workflowStatus;
    const isDone = workflowStatus === "images_ready" || workflowStatus === "video_ready" || workflowStatus === "published";
    const hasFailed = progress?.suggestedResumeAction && progress.suggestedResumeAction !== "none";
    const completedRef = useRef(false);

    // Auto-advance when done (useEffect to prevent infinite re-renders)
    useEffect(() => {
        if (isDone && onComplete && !completedRef.current) {
            completedRef.current = true;
            const timer = setTimeout(onComplete, 500);
            return () => clearTimeout(timer);
        }
    }, [isDone, onComplete]);

    const getStepLabel = () => {
        switch (workflowStatus) {
            case "draft": return "Preparing...";
            case "content_ready": return "Content generated, generating scenes...";
            case "images_ready": return "Images ready!";
            case "video_ready": return "Videos ready!";
            case "published": return "Published!";
            default: return "Generating...";
        }
    };

    const getProgressPercent = () => {
        if (!progress?.pipelineSteps) return 10;
        const completed = progress.pipelineSteps.filter(s => s.status === "completed").length;
        return Math.min(100, Math.round((completed / progress.pipelineSteps.length) * 100));
    };

    return (
        <div className="space-y-6">
            {/* Hero backdrop */}
            {backgroundImage && (
                <div className="relative rounded-xl overflow-hidden h-48">
                    <Image src={backgroundImage} alt="" width={0} height={0} className="w-full h-full object-cover blur-sm opacity-50" style={{ width: "100%", height: "100%" }} sizes="100vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>
            )}

            {/* Status */}
            <div className="flex flex-col items-center gap-4 py-8">
                {isDone ? (
                    <CheckCircle className="w-16 h-16 text-green-500" />
                ) : error ? (
                    <XCircle className="w-16 h-16 text-red-500" />
                ) : (
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                )}

                <div className="text-center space-y-1">
                    <h3 className="text-xl font-semibold">
                        {error ? "Generation Failed" : isDone ? "Generation Complete" : "Generating..."}
                    </h3>
                    <p className="text-sm text-muted-foreground">{getStepLabel()}</p>
                </div>

                {/* Progress bar */}
                {!isDone && !error && (
                    <div className="w-full max-w-md">
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${getProgressPercent()}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center mt-1">
                            {getProgressPercent()}%
                        </p>
                    </div>
                )}
            </div>

            {/* Pipeline detail */}
            {progress?.pipelineSteps && (
                <PipelineDetail steps={progress.pipelineSteps} message={progress.generationMessage} />
            )}

            {/* Error actions */}
            {error && (
                <div className="flex gap-3">
                    {onRetryFailedImages && hasFailed && (
                        <button
                            onClick={onRetryFailedImages}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Retry Failed
                        </button>
                    )}
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="flex-1 flex items-center justify-center gap-2 py-3 border border-border bg-background text-foreground rounded-lg font-medium"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                    )}
                </div>
            )}

            {/* Tokens used */}
            {progress?.totalTokens && progress.totalTokens > 0 && (
                <div className="text-xs text-muted-foreground text-center">
                    Tokens used: {progress.totalTokens.toLocaleString()}
                </div>
            )}
        </div>
    );
}
