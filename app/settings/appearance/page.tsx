"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon, Monitor, Check, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { settings } from "@/lib/api/settings";
import { showSuccess, showError } from "@/lib/toast-utils";

export default function AppearanceSettingsPage() {
    const { theme, setTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "system">("system");
    const [selectedFontSize, setSelectedFontSize] = useState<"small" | "medium" | "large">("medium");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const s = await settings.get();
                if (cancelled) return;
                const t = (s.theme || theme || "system") as "light" | "dark" | "system";
                setSelectedTheme(t);
                setSelectedFontSize(s.fontSize || "medium");
                setTheme(t);
                applyFontSize(s.fontSize || "medium");
            } catch (e) {
                console.error(e);
                if (theme === "light" || theme === "dark" || theme === "system") {
                    setSelectedTheme(theme);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const applyFontSize = (size: "small" | "medium" | "large") => {
        if (typeof document === "undefined") return;
        const root = document.documentElement;
        root.style.fontSize = size === "small" ? "14px" : size === "large" ? "18px" : "16px";
    };

    const onThemeChange = async (value: "light" | "dark" | "system") => {
        setSelectedTheme(value);
        setTheme(value);
        setSaving(true);
        try {
            await settings.updateTheme(value);
            showSuccess("Theme updated");
        } catch (e: unknown) {
            showError(e instanceof Error ? e.message : "Failed to save theme");
        } finally {
            setSaving(false);
        }
    };

    const onFontSizeChange = async (value: "small" | "medium" | "large") => {
        setSelectedFontSize(value);
        applyFontSize(value);
        setSaving(true);
        try {
            await settings.updateFontSize(value);
            showSuccess("Font size updated");
        } catch (e: unknown) {
            showError(e instanceof Error ? e.message : "Failed to save font size");
        } finally {
            setSaving(false);
        }
    };

    const themes = [
        { value: "light" as const, label: "Light", icon: Sun },
        { value: "dark" as const, label: "Dark", icon: Moon },
        { value: "system" as const, label: "System", icon: Monitor },
    ];

    const fontSizes = [
        { value: "small" as const, label: "Small" },
        { value: "medium" as const, label: "Medium" },
        { value: "large" as const, label: "Large" },
    ];

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Appearance</h2>
                <p className="text-muted-foreground">Customize the look and feel of the application.</p>
                {saving && <p className="text-xs text-muted-foreground mt-1">Saving…</p>}
            </div>

            <Card>
                <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Theme</h2>
                    <div className="space-y-2">
                        {themes.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                onClick={() => onThemeChange(item.value)}
                                className={`
                                    w-full h-[40px] rounded-lg border-2 flex items-center justify-between px-4 transition-all
                                    ${selectedTheme === item.value
                                        ? "bg-primary text-white border-primary"
                                        : "bg-transparent border-border hover:border-primary/50"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </div>
                                {selectedTheme === item.value && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Text Size</h2>
                    <div className="space-y-2">
                        {fontSizes.map((size) => (
                            <button
                                key={size.value}
                                type="button"
                                onClick={() => onFontSizeChange(size.value)}
                                className={`
                                    w-full h-[40px] rounded-lg border-2 flex items-center justify-between px-4 transition-all
                                    ${selectedFontSize === size.value
                                        ? "bg-primary text-white border-primary"
                                        : "bg-transparent border-border hover:border-primary/50"
                                    }
                                `}
                            >
                                <span className="text-sm font-medium">{size.label}</span>
                                {selectedFontSize === size.value && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
