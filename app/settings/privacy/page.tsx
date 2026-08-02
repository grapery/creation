"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { settings } from "@/lib/api/settings";
import { showError, showSuccess } from "@/lib/toast-utils";

function Row({
    title,
    desc,
    checked,
    onChange,
}: {
    title: string;
    desc?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-1">
            <div className="flex-1 min-w-0">
                <p className="font-medium">{title}</p>
                {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    );
}

export default function PrivacySettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [teenProtection, setTeenProtection] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState<"public" | "followers_only" | "private">(
        "public"
    );
    const [showOnlineStatus, setShowOnlineStatus] = useState(true);
    const [showReadReceipts, setShowReadReceipts] = useState(true);
    const [allowMessagesFrom, setAllowMessagesFrom] = useState("everyone");
    const [allowCommentsFrom, setAllowCommentsFrom] = useState("everyone");

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const s = await settings.get();
                if (cancelled) return;
                setTeenProtection(!!s.teenProtectionEnabled);
                setProfileVisibility(s.profileVisibility || "public");
                setShowOnlineStatus(s.showOnlineStatus !== false);
                setShowReadReceipts(s.showReadReceipts !== false);
                setAllowMessagesFrom(s.allowMessagesFrom || "everyone");
                setAllowCommentsFrom(s.allowCommentsFrom || "everyone");
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await settings.update({
                teenProtectionEnabled: teenProtection,
                profileVisibility,
                showOnlineStatus,
                showReadReceipts,
                allowMessagesFrom: allowMessagesFrom as any,
                allowCommentsFrom: allowCommentsFrom as any,
            });
            showSuccess("Privacy settings saved");
        } catch (e) {
            showError(e instanceof Error ? e.message : "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Privacy & Safety
                </h2>
                <p className="text-muted-foreground">Manage your privacy and safety settings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Teen protection</CardTitle>
                    <CardDescription>
                        Prefer safer discovery defaults. Genre preferences still apply.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Row
                        title="Enable teen protection"
                        desc="Safer feed defaults aligned with Voyager"
                        checked={teenProtection}
                        onChange={setTeenProtection}
                    />
                    <p className="text-sm text-muted-foreground">
                        Manage genres in{" "}
                        <Link href="/settings/preferences" className="underline hover:text-foreground">
                            Discover preferences
                        </Link>
                        .
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Row
                        title="Public profile"
                        desc="Visible to everyone when enabled"
                        checked={profileVisibility === "public"}
                        onChange={(v) => setProfileVisibility(v ? "public" : "private")}
                    />
                    <Row
                        title="Show online status"
                        checked={showOnlineStatus}
                        onChange={setShowOnlineStatus}
                    />
                    <Row title="Read receipts" checked={showReadReceipts} onChange={setShowReadReceipts} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Interactions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Row
                        title="Allow messages from everyone"
                        checked={allowMessagesFrom === "everyone"}
                        onChange={(v) => setAllowMessagesFrom(v ? "everyone" : "followers_only")}
                    />
                    <Row
                        title="Allow comments from everyone"
                        checked={allowCommentsFrom === "everyone"}
                        onChange={(v) => setAllowCommentsFrom(v ? "everyone" : "followers_only")}
                    />
                    <p className="text-sm text-muted-foreground">
                        Blocked users:{" "}
                        <Link href="/settings/blocked" className="underline hover:text-foreground">
                            Manage list
                        </Link>
                    </p>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save
                </Button>
            </div>
        </div>
    );
}
