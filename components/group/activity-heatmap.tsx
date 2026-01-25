"use client";

import { ActivityHeatmapResponse, ActivityHeatmapData, ActivityTimeRange } from "@/lib/types";
import { cn } from "@/lib/utils";

// Mock Tooltip for now if not installed, or I should install.
// I'll install radix-ui tooltip.
// Actually I'll use a simple title attribute for now to save installing more packages unless strictly needed.
// Heatmap usually needs a good tooltip.

interface ActivityHeatmapProps {
    data: ActivityHeatmapData[];
    totalCount?: number;
    selectedTimeRange?: ActivityTimeRange;
    selectedDate?: string | null;
    isLoading?: boolean;
    onTimeRangeChange?: (range: ActivityTimeRange) => void;
    onDateSelect?: (date: string | null) => void;
}

export function ActivityHeatmap({
    data,
    totalCount,
    selectedTimeRange,
    selectedDate,
    isLoading,
    onTimeRangeChange,
    onDateSelect
}: ActivityHeatmapProps) {
    if (isLoading) {
        return <div className="h-20 w-full animate-pulse bg-secondary/30 rounded-lg"></div>;
    }

    if (!data || data.length === 0) {
        return <div className="text-center py-4 text-muted-foreground text-xs">No activity data available</div>;
    }

    const maxCount = Math.max(...data.map(d => d.count), 1);
    const startDate = data[0]?.date || "";
    const endDate = data[data.length - 1]?.date || "";

    const getColor = (count: number) => {
        if (count === 0) return "bg-secondary";
        const intensity = count / maxCount;
        if (intensity < 0.25) return "bg-primary/20";
        if (intensity < 0.5) return "bg-primary/40";
        if (intensity < 0.75) return "bg-primary/60";
        return "bg-primary";
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {Object.values(ActivityTimeRange).map((range) => (
                        <button
                            key={range}
                            onClick={() => onTimeRangeChange?.(range)}
                            className={cn(
                                "px-2 py-1 text-xs rounded-md transition-colors",
                                selectedTimeRange === range
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="text-xs text-muted-foreground">
                    Total: <span className="font-semibold text-foreground">{totalCount}</span>
                </div>
            </div>

            <div className="w-full overflow-x-auto pb-2">
                <div className="flex gap-1 min-w-[300px]">
                    {data.map((d) => (
                        <div
                            key={d.date}
                            className="flex flex-col gap-1 items-center group relative cursor-pointer"
                            onClick={() => onDateSelect?.(d.date === selectedDate ? null : d.date)}
                        >
                            <div
                                className={cn(
                                    "h-8 w-2 md:h-12 md:w-3 rounded-sm transition-all",
                                    getColor(d.count),
                                    selectedDate === d.date ? "ring-2 ring-ring ring-offset-2" : ""
                                )}
                                title={`${d.date}: ${d.count} activities`}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{startDate}</span>
                    <span>{endDate}</span>
                </div>
            </div>
        </div>
    );
}
