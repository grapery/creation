"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { creation } from "@/lib/api/creation";
import { errorMessage } from "@/lib/utils";
import type { StoryboardGenerationProgress } from "@/lib/types";

interface UseGenerationPollingOptions {
    storyboardId: string | null;
    enabled?: boolean;
    intervalMs?: number[];
}

interface UseGenerationPollingReturn {
    progress: StoryboardGenerationProgress | null;
    isGenerating: boolean;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    retryFailedImages: () => Promise<void>;
    cancelGeneration: () => Promise<void>;
}

export function useGenerationPolling({
    storyboardId,
    enabled = true,
    intervalMs = [2000, 5000, 10000],
}: UseGenerationPollingOptions): UseGenerationPollingReturn {
    const [progress, setProgress] = useState<StoryboardGenerationProgress | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [backoffIndex, setBackoffIndex] = useState(0);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    const isGenerating = progress?.isGenerating ?? false;

    const fetchProgress = useCallback(async () => {
        if (!storyboardId) return;
        setIsLoading(true);
        try {
            const data = await creation.getGenerationProgress(storyboardId);
            setProgress(data);
            setError(null);
            // Increase backoff while generating
            if (data.isGenerating) {
                setBackoffIndex(prev => Math.min(prev + 1, intervalMs.length - 1));
            } else {
                setBackoffIndex(0);
            }
        } catch (err: unknown) {
            setError(errorMessage(err) || "Failed to fetch progress");
        } finally {
            setIsLoading(false);
        }
    }, [storyboardId, intervalMs]);

    // Polling effect
    useEffect(() => {
        if (!storyboardId || !enabled) return;

        // Initial fetch
        fetchProgress();

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, [storyboardId, enabled]);

    // Separate polling loop that starts after first fetch
    useEffect(() => {
        if (!storyboardId || !enabled || !isGenerating) {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            return;
        }

        const interval = intervalMs[backoffIndex] || intervalMs[intervalMs.length - 1];
        pollingRef.current = setInterval(fetchProgress, interval);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [storyboardId, enabled, isGenerating, backoffIndex, fetchProgress, intervalMs]);

    const retryFailedImages = useCallback(async () => {
        if (!storyboardId) return;
        try {
            await creation.retryFailedImages(storyboardId);
            await fetchProgress();
        } catch (err: unknown) {
            setError(errorMessage(err) || "Failed to retry");
        }
    }, [storyboardId, fetchProgress]);

    const cancelGeneration = useCallback(async () => {
        if (!storyboardId) return;
        try {
            await creation.cancelGeneration(storyboardId);
            await fetchProgress();
        } catch (err: unknown) {
            setError(errorMessage(err) || "Failed to cancel");
        }
    }, [storyboardId, fetchProgress]);

    return {
        progress,
        isGenerating,
        isLoading,
        error,
        refetch: fetchProgress,
        retryFailedImages,
        cancelGeneration,
    };
}
