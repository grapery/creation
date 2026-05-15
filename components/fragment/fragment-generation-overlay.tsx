"use client";

import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface FragmentGenerationOverlayProps {
    status: "idle" | "generating" | "polling" | "completed" | "failed";
    progress?: string;
    error?: string;
    onRetry?: () => void;
}

export function FragmentGenerationOverlay({
    status,
    progress,
    error,
    onRetry,
}: FragmentGenerationOverlayProps) {
    if (status === "idle") return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-4 space-y-4 shadow-xl">
                {status === "generating" || status === "polling" ? (
                    <>
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <h3 className="text-lg font-semibold text-foreground">
                                AI Generating...
                            </h3>
                            {progress && (
                                <p className="text-sm text-muted-foreground text-center">
                                    {progress}
                                </p>
                            )}
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-500 animate-pulse"
                                style={{ width: "60%" }}
                            />
                        </div>
                    </>
                ) : status === "completed" ? (
                    <div className="flex flex-col items-center gap-3">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                        <h3 className="text-lg font-semibold text-foreground">
                            Generation Complete
                        </h3>
                    </div>
                ) : status === "failed" ? (
                    <div className="flex flex-col items-center gap-3">
                        <XCircle className="w-12 h-12 text-red-500" />
                        <h3 className="text-lg font-semibold text-foreground">
                            Generation Failed
                        </h3>
                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                            >
                                Retry
                            </button>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
