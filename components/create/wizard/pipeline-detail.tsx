"use client";

import { CheckCircle, Loader2, XCircle, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { GenerationPipelineStep } from "@/lib/types";

interface PipelineDetailProps {
    steps: GenerationPipelineStep[];
    message?: string;
}

function StatusIcon({ status }: { status: string }) {
    switch (status) {
        case "completed":
            return <CheckCircle className="w-4 h-4 text-green-500" />;
        case "processing":
        case "running":
            return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
        case "failed":
            return <XCircle className="w-4 h-4 text-red-500" />;
        default:
            return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
}

export function PipelineDetail({ steps, message }: PipelineDetailProps) {
    const [expanded, setExpanded] = useState(false);

    if (!steps || steps.length === 0) return null;

    return (
        <div className="border border-border rounded-xl overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Pipeline Details</span>
                    {message && <span className="text-xs text-muted-foreground">— {message}</span>}
                </div>
                {expanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
            </button>

            {expanded && (
                <div className="border-t border-border p-3 space-y-3">
                    {steps.map((step) => (
                        <div key={step.phase} className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <StatusIcon status={step.status} />
                                <span className="text-sm font-medium">{step.title}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                    step.status === "completed" ? "bg-green-100 text-green-700" :
                                    step.status === "failed" ? "bg-red-100 text-red-700" :
                                    step.status === "running" || step.status === "processing" ? "bg-blue-100 text-blue-700" :
                                    "bg-gray-100 text-gray-700"
                                }`}>
                                    {step.status}
                                </span>
                            </div>
                            {step.summary && (
                                <p className="text-xs text-muted-foreground ml-6">{step.summary}</p>
                            )}
                            {step.errorMessage && (
                                <p className="text-xs text-red-500 ml-6">{step.errorMessage}</p>
                            )}
                            {step.sceneItems && step.sceneItems.length > 0 && (
                                <div className="ml-6 space-y-1">
                                    {step.sceneItems.map((item) => (
                                        <div key={item.sceneId} className="flex items-center gap-2">
                                            <StatusIcon status={item.status} />
                                            <span className="text-xs">{item.sceneTitle || item.sceneId.slice(0, 8)}</span>
                                            {item.errorMessage && (
                                                <span className="text-xs text-red-500">{item.errorMessage}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
