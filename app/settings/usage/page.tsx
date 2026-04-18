"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BarChart3, Zap } from "lucide-react";
import { tokenUsage } from "@/lib/api/token-usage";
import type { TokenUsageStats } from "@/lib/types";

export default function UsagePage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<TokenUsageStats | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await tokenUsage.getStats();
            setStats(data);
        } catch (err) {
            console.error("Failed to load usage stats:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    if (loading) {
        return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    const usagePercent = stats && stats.totalLimit > 0
        ? Math.round((stats.totalUsed / stats.totalLimit) * 100)
        : 0;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Token Usage</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Zap className="h-4 w-4" />
                        Overall Usage ({stats?.period || "This Month"})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>{stats?.totalUsed.toLocaleString() || 0} tokens used</span>
                            <span className="text-muted-foreground">
                                {stats?.totalLimit === -1 ? "Unlimited" : `${stats?.totalLimit.toLocaleString()} limit`}
                            </span>
                        </div>
                        {stats && stats.totalLimit > 0 && (
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${usagePercent > 90 ? "bg-red-500" : usagePercent > 70 ? "bg-yellow-500" : "bg-primary"}`}
                                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {stats?.byType && Object.keys(stats.byType).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Usage by Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(stats.byType).map(([type, used]) => (
                                <div key={type} className="flex items-center justify-between">
                                    <span className="text-sm capitalize">{type.replace(/_/g, " ")}</span>
                                    <span className="text-sm font-medium">{(used as number).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
