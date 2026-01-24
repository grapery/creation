"use client";

import { ActivityHeatmapResponse } from "@/lib/api/groups";
import { cn } from "@/lib/utils";

// Mock Tooltip for now if not installed, or I should install.
// I'll install radix-ui tooltip.
// Actually I'll use a simple title attribute for now to save installing more packages unless strictly needed.
// Heatmap usually needs a good tooltip.

export function ActivityHeatmap({ data }: { data: ActivityHeatmapResponse }) {
    // Simple grid of squares.
    // Data.heatmapData contains { date, count }
    // We need to render a grid (like GitHub contributions).
    // For 'month', it's about 30 days.
    // We can just render a flex row of squares.

    if (!data?.heatmapData) return null;

    const maxCount = Math.max(...data.heatmapData.map(d => d.count), 1);

    const getColor = (count: number) => {
        if (count === 0) return "bg-secondary";
        const intensity = count / maxCount;
        if (intensity < 0.25) return "bg-primary/20";
        if (intensity < 0.5) return "bg-primary/40";
        if (intensity < 0.75) return "bg-primary/60";
        return "bg-primary";
    };

    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="flex gap-1 min-w-[300px]">
                {data.heatmapData.map((d) => (
                    <div key={d.date} className="flex flex-col gap-1 items-center group relative">
                        <div
                            className={cn("h-8 w-2 md:h-12 md:w-3 rounded-sm transition-colors", getColor(d.count))}
                            title={`${d.date}: ${d.count} activities`}
                        />
                        {/* Tooltip logic moved to title for simplicity/performance */}
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{data.startDate}</span>
                <span>{data.endDate}</span>
            </div>
        </div>
    );
}
