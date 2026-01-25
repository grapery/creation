"use client";

import { useState } from "react";
import { ActivityHeatmapData, ActivityTimeRange } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActivityHeatmapProps {
    data: ActivityHeatmapData[];
    totalCount: number;
    selectedTimeRange: ActivityTimeRange;
    selectedDate: string | null;
    isLoading: boolean;
    onTimeRangeChange: (range: ActivityTimeRange) => void;
    onDateSelect: (date: string | null) => void;
}

export function ActivityHeatmap({
    data,
    totalCount,
    selectedTimeRange,
    selectedDate,
    isLoading,
    onTimeRangeChange,
    onDateSelect,
}: ActivityHeatmapProps) {
    const gridConfig = {
        today: { rows:1, columns: 1 },
        week: { rows: 1, columns: 7 },
        month: { rows: 5, columns: 7 },
    };

    const config = gridConfig[selectedTimeRange];
    const squareSize = 14;
    const spacing = 4;

    const getActivityColor = (count: number) => {
        switch (count) {
            case 0:
                return "bg-secondary";
            case 1:
            case 2:
                return "bg-green-400/60";
            case 3:
            case 4:
            case 5:
                return "bg-green-500";
            default:
                return "bg-green-600";
        }
    };

    const singleDayView = (dataPoint: ActivityHeatmapData) => {
        const isSelected = selectedDate === dataPoint.date;

        return (
            <div className="flex flex-col items-center gap-2">
                <div
                    className={cn(
                        "rounded-8 flex items-center justify-center",
                        getActivityColor(dataPoint.count)
                    )}
                    style={{
                        width: 60,
                        height: 60,
                    }}
                >
                    <span
                        className={cn(
                            "text-lg font-bold",
                            dataPoint.count > 0 ? "text-white" : "text-muted-foreground"
                        )}
                    >
                        {dataPoint.count}
                    </span>
                </div>
                {isSelected && (
                    <div
                        className="rounded-8 border-2 border-green-500"
                        style={{
                            width: 60,
                            height: 60,
                            position: "absolute",
                        }}
                    />
                )}
                <span className="text-xs text-muted-foreground">Today</span>
            </div>
        );
    };

    const weekView = (heatmapData: ActivityHeatmapData[]) => {
        const weekdayLabel = (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", { weekday: "narrow" });
        };

        return (
            <div className="flex gap-1">
                {heatmapData.slice(0, 7).map((dataPoint) => {
                    const isSelected = selectedDate === dataPoint.date;

                    return (
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={cn(
                                    "rounded-[6px] flex items-center justify-center",
                                    getActivityColor(dataPoint.count)
                                )}
                                style={{
                                    width: squareSize * 2.5,
                                    height: squareSize * 2.5,
                                }}
                            >
                                <span
                                    className={cn(
                                        "text-[11px] font-medium",
                                        dataPoint.count > 0 ? "text-white" : "text-muted-foreground"
                                    )}
                                >
                                    {dataPoint.count}
                                </span>
                            </div>
                            {isSelected && (
                                <div
                                    className="rounded-[6px] border-2 border-green-500"
                                    style={{
                                        width: squareSize * 2.5,
                                        height: squareSize * 2.5,
                                        position: "absolute",
                                    }}
                                />
                            )}
                            <span
                                className={cn(
                                    "text-[10px]",
                                    isSelected ? "text-green-500" : "text-muted-foreground"
                                )}
                            >
                                {weekdayLabel(dataPoint.date)}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const monthView = (heatmapData?: ActivityHeatmapData[] | null) => {
        const weekdayHeaders = ["S", "M", "T", "W", "T", "F", "S"];

        // Calculate grid data with empty slots for offset
        const gridData: (ActivityHeatmapData | null)[][] = [];
        let currentRow: (ActivityHeatmapData | null)[] = [];
        const today = new Date().toISOString().split("T")[0];

        if (!heatmapData || heatmapData.length === 0) {
            return (
                <div className="text-center py-8 text-muted-foreground">
                    No data for this month
                </div>
            );
        }

        const firstDate = new Date(heatmapData[0].date);
        const weekday = firstDate.getDay();
        const offset = weekday;

        // Add empty slots for offset
        for (let i = 0; i < offset; i++) {
            currentRow.push(null);
        }

        // Add actual data
        let dayOfWeek = weekday;
        for (const dataPoint of heatmapData) {
            currentRow.push(dataPoint);
            dayOfWeek++;

            if (dayOfWeek === 7) {
                gridData.push([...currentRow]);
                currentRow = [];
                dayOfWeek = 0;
            }
        }

        // Add last row
        if (currentRow.length > 0) {
            gridData.push([...currentRow]);
        }

        return (
            <div className="space-y-1">
                {/* Week day headers */}
                <div className="flex gap-1">
                    {weekdayHeaders.map((day) => (
                        <div
                            key={day}
                            className="text-[10px] text-muted-foreground font-medium"
                            style={{ width: squareSize, height: squareSize }}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div
                    className="grid gap-1"
                    style={{
                        gridTemplateColumns: `repeat(7, ${squareSize}px)`,
                    }}
                >
                    {gridData.flat().map((dataPoint, index) => {
                        if (dataPoint === null) {
                            return (
                                <div
                                    key={index}
                                    className="w-full h-full"
                                    style={{
                                        width: squareSize,
                                        height: squareSize,
                                    }}
                                />
                            );
                        }

                        const isSelected = selectedDate === dataPoint.date;
                        const isToday = dataPoint.date === today;

                        return (
                            <div
                                key={dataPoint.date}
                                className={cn(
                                    "rounded-[2px] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity",
                                    getActivityColor(dataPoint.count)
                                )}
                                style={{
                                    width: squareSize,
                                    height: squareSize,
                                }}
                                onClick={() => {
                                    if (!isToday) {
                                        onDateSelect(isSelected ? null : dataPoint.date);
                                    }
                                }}
                            >
                                {isSelected && (
                                    <div
                                        className="rounded-[2px] border-2 border-green-500"
                                        style={{
                                            width: squareSize,
                                            height: squareSize,
                                            position: "absolute",
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const activityColors = [
        { color: "bg-secondary", label: "Less" },
        { color: "bg-green-400", label: "" },
        { color: "bg-green-500", label: "" },
        { color: "bg-green-600", label: "" },
        { color: "bg-green-700", label: "More" },
    ];

    return (
        <div className="space-y-4">
            {/* Header with title and time range selector */}
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">Activity Overview</h2>

                {/* Time Range Picker */}
                <div className="bg-secondary rounded-full p-1 border border-border inline-flex">
                    {[
                        { value: ActivityTimeRange.TODAY, label: "Today" },
                        { value: ActivityTimeRange.WEEK, label: "Week" },
                        { value: ActivityTimeRange.MONTH, label: "Month" },
                    ].map((range) => (
                        <button
                            key={range.value}
                            onClick={() => onTimeRangeChange(range.value)}
                            className={cn(
                                "px-4 py-1 rounded-full text-[11px] font-medium transition-all",
                                selectedTimeRange === range.value
                                    ? "bg-card text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground/80"
                            )}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Less</span>
                <div className="flex gap-[3px]">
                    {activityColors.slice(1, 5).map((item, index) => (
                        <div
                            key={index}
                            className={cn("rounded-full", item.color)}
                            style={{
                                width: 10,
                                height: 10,
                            }}
                        />
                    ))}
                </div>
                <span className="text-xs text-muted-foreground">More</span>

                <div className="flex-1" />

                {/* Total count badge */}
                <span className="text-xs font-medium text-muted-foreground">
                    {totalCount} activities
                </span>
            </div>

            {/* Heatmap Grid */}
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-border border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div>
                    {selectedTimeRange === ActivityTimeRange.TODAY ? (
                        data.length > 0 ? singleDayView(data[0]) : <div className="text-center py-8 text-muted-foreground">No data</div>
                    ) : selectedTimeRange === ActivityTimeRange.WEEK ? (
                        weekView(data)
                    ) : (
                        monthView(data)
                    )}
                </div>
            )}
        </div>
    );
}
