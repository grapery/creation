"use client";

import { ReactNode } from "react";
import { FileText, Layers, Drama, Trash2, Loader2 } from "lucide-react";

interface ContentGridProps {
    title: string;
    icon: ReactNode;
    children: ReactNode;
    loading?: boolean;
    empty?: boolean;
    emptyMessage?: string;
    emptyIcon?: ReactNode;
}

export function ContentGrid({
    title,
    icon,
    children,
    loading = false,
    empty = false,
    emptyMessage = "No content yet",
    emptyIcon,
}: ContentGridProps) {
    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (empty) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
                <div className="text-center space-y-4 max-w-md">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted/10 flex items-center justify-center">
                        {emptyIcon || <FileText className="h-8 w-8 text-muted-foreground/50" />}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            {emptyMessage}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            Content created will appear here
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-border/50">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    {icon}
                </div>
                <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {children}
            </div>
        </div>
    );
}
