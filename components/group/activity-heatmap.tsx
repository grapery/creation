"use client";

import { useMemo } from "react";
import { ActivityHeatmapData, ActivityTimeRange } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
    addDays,
    eachDayOfInterval,
    endOfWeek,
    format,
    getDay,
    startOfWeek,
    subWeeks,
    startOfDay,
    isSameDay,
    parseISO,
    isValid
} from "date-fns";

interface ActivityHeatmapProps {
    data: ActivityHeatmapData[];
    totalCount?: number;
    selectedTimeRange?: ActivityTimeRange;
    isLoading?: boolean;
}

export function ActivityHeatmap({
    data,
    totalCount,
    isLoading,
}: ActivityHeatmapProps) {
    // Generate the last 52 weeks of dates for the calendar grid
    const calendarData = useMemo(() => {
        const today = new Date();
        const endDate = today;
        const startDate = subWeeks(today, 51); // 52 weeks total including current

        // Align start to the start of that week (Sunday)
        const alignedStartDate = startOfWeek(startDate);

        // Generate all days
        const days = eachDayOfInterval({
            start: alignedStartDate,
            end: endDate
        });

        // Create a map for quick lookup of activity counts
        const activityMap = new Map<string, number>();
        if (data) {
            data.forEach(d => {
                // Ensure date format matches key
                // API usually returns YYYY-MM-DD
                activityMap.set(d.date, d.count);
            });
        }

        // Group by weeks for rendering
        const weeks: { days: { date: Date; count: number; level: number }[] }[] = [];
        let currentWeek: { date: Date; count: number; level: number }[] = [];

        days.forEach((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const count = activityMap.get(dateKey) || 0;

            // Calculate intensity level (0-4)
            let level = 0;
            if (count > 0) level = 1;
            if (count > 2) level = 2;
            if (count > 5) level = 3;
            if (count > 10) level = 4;

            currentWeek.push({ date: day, count, level });

            if (currentWeek.length === 7) {
                weeks.push({ days: currentWeek });
                currentWeek = [];
            }
        });

        // Push partial last week if exists
        if (currentWeek.length > 0) {
            weeks.push({ days: currentWeek });
        }

        return weeks;
    }, [data]);

    if (isLoading) {
        return <div className="h-[120px] w-full animate-pulse bg-secondary/30 rounded-lg"></div>;
    }

    // Color scales for levels 0-4
    // Using green shades similar to GitHub but adaptable to theme
    const getLevelColor = (level: number) => {
        switch (level) {
            case 0: return "bg-secondary/40"; // Empty
            case 1: return "bg-emerald-200 dark:bg-emerald-900/60";
            case 2: return "bg-emerald-300 dark:bg-emerald-700";
            case 3: return "bg-emerald-400 dark:bg-emerald-600";
            case 4: return "bg-emerald-500 dark:bg-emerald-500";
            default: return "bg-secondary";
        }
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-muted-foreground">{totalCount ?? 0} contributions in the last year</h4>
            </div>

            <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-secondary">
                <div className="flex gap-1 min-w-max">
                    {/* Day labels column */}
                    <div className="grid grid-rows-7 gap-1 pr-2 text-[10px] text-muted-foreground h-[95px]">
                        <span className="sr-only">Sun</span>
                        <span>Mon</span>
                        <span className="sr-only">Tue</span>
                        <span>Wed</span>
                        <span className="sr-only">Thu</span>
                        <span>Fri</span>
                        <span className="sr-only">Sat</span>
                    </div>

                    {/* Weeks columns */}
                    {calendarData.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-rows-7 gap-1 h-[95px]">
                            {week.days.map((day, dayIndex) => (
                                <div
                                    key={dayIndex}
                                    className={cn(
                                        "w-3 h-3 rounded-[2px] transition-colors hover:ring-1 hover:ring-foreground/50",
                                        getLevelColor(day.level)
                                    )}
                                    title={`${format(day.date, 'MMMM d, yyyy')}: ${day.count} activities`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className={cn("w-3 h-3 rounded-[2px]", getLevelColor(0))} />
                    <div className={cn("w-3 h-3 rounded-[2px]", getLevelColor(1))} />
                    <div className={cn("w-3 h-3 rounded-[2px]", getLevelColor(2))} />
                    <div className={cn("w-3 h-3 rounded-[2px]", getLevelColor(3))} />
                    <div className={cn("w-3 h-3 rounded-[2px]", getLevelColor(4))} />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
