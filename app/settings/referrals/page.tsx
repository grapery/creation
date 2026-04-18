"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Gift, Users, TrendingUp, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { referrals } from "@/lib/api/referrals";
import type { ReferralStats } from "@/lib/types";

export default function ReferralsPage() {
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState("");
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [copied, setCopied] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [codeRes, statsRes] = await Promise.all([
                referrals.getCode(),
                referrals.getStats(),
            ]);
            setCode(codeRes.referralCode);
            setStats(statsRes);
        } catch (err) {
            console.error("Failed to load referral data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Invite Friends</h1>
                <p className="text-muted-foreground">Share your referral code and earn rewards</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5" />
                        Your Referral Code
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3">
                        <code className="flex-1 p-3 rounded-lg bg-muted text-lg font-mono text-center tracking-wider">
                            {code}
                        </code>
                        <Button size="icon" variant="outline" onClick={handleCopy}>
                            {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {stats && (
                <div className="grid grid-cols-3 gap-3">
                    <Card>
                        <CardContent className="pt-4 text-center">
                            <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
                            <div className="text-xs text-muted-foreground">Total Referrals</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4 text-center">
                            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
                            <div className="text-2xl font-bold">{stats.activeReferrals}</div>
                            <div className="text-xs text-muted-foreground">Active</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-4 text-center">
                            <Gift className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                            <div className="text-2xl font-bold">{stats.earnedPoints}</div>
                            <div className="text-xs text-muted-foreground">Points Earned</div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
