"use client";

import { useEffect, useState } from "react";
import { Bell, Mail, MessageSquare, Heart, UserPlus, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/language-provider";
import {
    settings,
    NotificationSettings,
    defaultNotificationSettings,
} from "@/lib/api/settings";
import { showError, showSuccess } from "@/lib/toast-utils";

export default function NotificationSettingsPage() {
    const { t } = useTranslation();
    const [prefs, setPrefs] = useState<NotificationSettings>(defaultNotificationSettings());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const s = await settings.get();
                if (!cancelled && s.notificationSettings) {
                    setPrefs(s.notificationSettings);
                }
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

    const patchPush = (key: keyof NotificationSettings["push"], value: boolean) => {
        setPrefs((p) => ({ ...p, push: { ...p.push, [key]: value } }));
    };
    const patchEmail = (key: keyof NotificationSettings["email"], value: boolean) => {
        setPrefs((p) => ({ ...p, email: { ...p.email, [key]: value } }));
    };
    const patchInApp = (key: keyof NotificationSettings["inApp"], value: boolean) => {
        setPrefs((p) => ({ ...p, inApp: { ...p.inApp, [key]: value } }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await settings.updateNotifications(prefs);
            showSuccess(t("notification_settings.saved", "Notification preferences saved"));
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
                    <Bell className="h-6 w-6" />
                    {t("notification_settings.title", "Notifications")}
                </h2>
                <p className="text-muted-foreground">
                    {t(
                        "notification_settings.subtitle",
                        "Synced with your account. Browser push is not available; use the iOS app for APNs."
                    )}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t("notification_settings.channels", "Channels")}</CardTitle>
                    <CardDescription>
                        {t("notification_settings.channels_desc", "Master switches for each channel")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Row
                        icon={<Mail className="h-5 w-5 text-primary" />}
                        title={t("notification_settings.email", "Email")}
                        desc="Email digests and alerts"
                        checked={prefs.email.enabled}
                        onChange={(v) => patchEmail("enabled", v)}
                    />
                    <Row
                        icon={<MessageSquare className="h-5 w-5 text-primary" />}
                        title={t("notification_settings.push", "Push")}
                        desc="Mobile push (iOS app)"
                        checked={prefs.push.enabled}
                        onChange={(v) => patchPush("enabled", v)}
                    />
                    <Row
                        icon={<Bell className="h-5 w-5 text-primary" />}
                        title="In-app"
                        desc="Notification center & SSE"
                        checked={prefs.inApp.enabled}
                        onChange={(v) => patchInApp("enabled", v)}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t("notification_settings.activity", "Activity")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Row
                        icon={<Heart className="h-5 w-5 text-primary" />}
                        title={t("notification_settings.likes", "Likes")}
                        checked={prefs.push.newLike}
                        onChange={(v) => patchPush("newLike", v)}
                    />
                    <Row
                        icon={<UserPlus className="h-5 w-5 text-primary" />}
                        title={t("notification_settings.follows", "New followers")}
                        checked={prefs.push.newFollower}
                        onChange={(v) => patchPush("newFollower", v)}
                    />
                    <Row
                        icon={<MessageSquare className="h-5 w-5 text-primary" />}
                        title={t("notification_settings.comments", "Comments")}
                        checked={prefs.push.newComment}
                        onChange={(v) => patchPush("newComment", v)}
                    />
                    <Row
                        icon={<CheckCircle className="h-5 w-5 text-primary" />}
                        title="Direct messages"
                        checked={prefs.push.directMessage}
                        onChange={(v) => patchPush("directMessage", v)}
                    />
                    <Row
                        icon={<MessageSquare className="h-5 w-5 text-primary" />}
                        title={t("notification_settings.story_updates", "Story updates")}
                        checked={prefs.push.storyUpdate}
                        onChange={(v) => patchPush("storyUpdate", v)}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{t("notification_settings.marketing", "Marketing")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Row
                        icon={<Mail className="h-5 w-5 text-primary" />}
                        title="Email marketing"
                        checked={prefs.email.marketing}
                        onChange={(v) => patchEmail("marketing", v)}
                    />
                    <Row
                        icon={<Bell className="h-5 w-5 text-primary" />}
                        title="Push marketing"
                        checked={prefs.push.marketing}
                        onChange={(v) => patchPush("marketing", v)}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {t("notification_settings.save", "Save")}
                </Button>
            </div>
        </div>
    );
}

function Row({
    icon,
    title,
    desc,
    checked,
    onChange,
}: {
    icon: React.ReactNode;
    title: string;
    desc?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
                <div>
                    <p className="font-medium">{title}</p>
                    {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
                </div>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    );
}
