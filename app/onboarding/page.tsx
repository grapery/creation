"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, Sparkles } from "lucide-react";
import { settings } from "@/lib/api/settings";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { showError, showSuccess } from "@/lib/toast-utils";
import { cn } from "@/lib/utils";
import { markOnboardingDone } from "@/lib/onboarding";

type Step = "welcome" | "genres" | "role";

export default function OnboardingPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { t } = useTranslation();
    const [step, setStep] = useState<Step>("welcome");
    const [catalog, setCatalog] = useState<{ key: string; label: string; emoji?: string }[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [role, setRole] = useState<"reader" | "creator">("reader");
    const [loading, setLoading] = useState(false);
    const [catalogError, setCatalogError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace("/login?next=/onboarding");
        }
    }, [user, authLoading, router]);

    const loadCatalog = useCallback(async () => {
        setLoading(true);
        setCatalogError(null);
        try {
            const [catalogData, prefs] = await Promise.all([
                settings.getGenreCatalog(),
                settings.getGenrePreferences().catch(() => ({ preferredGenres: [] as string[] })),
            ]);
            setCatalog(catalogData.genres || []);
            setSelected(new Set(prefs.preferredGenres || []));
            if (!(catalogData.genres || []).length) {
                setCatalogError("No genres available yet.");
            }
        } catch (e) {
            console.error(e);
            setCatalogError(e instanceof Error ? e.message : "Failed to load genres");
            setCatalog([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (step === "genres" && catalog.length === 0) {
            loadCatalog();
        }
    }, [step, catalog.length, loadCatalog]);

    const finish = async () => {
        setSaving(true);
        try {
            if (selected.size > 0) {
                await settings.updateGenrePreferences(Array.from(selected));
            }
            markOnboardingDone();
            if (typeof window !== "undefined") {
                localStorage.setItem("voyager_onboarding_role", role);
            }
            showSuccess("Welcome aboard!");
            router.replace(role === "creator" ? "/create" : "/");
        } catch (e) {
            showError(e instanceof Error ? e.message : "Failed to save preferences");
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        {step === "welcome" && t("onboarding.welcome_prefix", "Welcome to")} Voyager
                        {step === "genres" && t("onboarding.choose_preferences", "Choose Your Preferences")}
                        {step === "role" && "How will you start?"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {step === "welcome" && (
                        <>
                            <p className="text-muted-foreground">
                                {t("onboarding.tagline", "AI-powered co-creation platform for stories")}
                            </p>
                            <Button className="w-full" onClick={() => setStep("genres")}>
                                {t("onboarding.start_using", "Get Started")}
                            </Button>
                        </>
                    )}

                    {step === "genres" && (
                        <>
                            <p className="text-sm text-muted-foreground">
                                {t("onboarding.choose_preferences_desc", "Select a few of your favorite story styles")}
                            </p>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : catalogError || catalog.length === 0 ? (
                                <div className="rounded-xl border border-dashed p-6 text-center space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        {catalogError || "No genres available yet."}
                                    </p>
                                    <Button variant="outline" size="sm" onClick={loadCatalog}>
                                        Retry
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                                    {catalog.map((g) => {
                                        const active = selected.has(g.key);
                                        return (
                                            <Badge
                                                key={g.key}
                                                variant={active ? "default" : "outline"}
                                                className={cn("cursor-pointer px-3 py-1.5", active && "gap-1")}
                                                onClick={() => {
                                                    setSelected((prev) => {
                                                        const next = new Set(prev);
                                                        if (next.has(g.key)) next.delete(g.key);
                                                        else next.add(g.key);
                                                        return next;
                                                    });
                                                }}
                                            >
                                                {active && <Check className="h-3 w-3" />}
                                                {g.emoji && <span className="mr-0.5">{g.emoji}</span>}
                                                {g.label || g.key}
                                            </Badge>
                                        );
                                    })}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setStep("welcome")}>
                                    Back
                                </Button>
                                <Button className="flex-1" onClick={() => setStep("role")}>
                                    Continue
                                </Button>
                            </div>
                        </>
                    )}

                    {step === "role" && (
                        <>
                            <button
                                type="button"
                                onClick={() => setRole("reader")}
                                className={cn(
                                    "w-full text-left rounded-xl border p-4 transition-colors",
                                    role === "reader" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                )}
                            >
                                <div className="font-semibold">
                                    {t("onboarding.reader_title", "Start as a Reader")}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {t("onboarding.reader_desc", "Browse amazing stories, collect inspiration fragments")}
                                </p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("creator")}
                                className={cn(
                                    "w-full text-left rounded-xl border p-4 transition-colors",
                                    role === "creator" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                )}
                            >
                                <div className="font-semibold">
                                    {t("onboarding.creator_title", "Start as a Creator")}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {t(
                                        "onboarding.creator_desc",
                                        "Create stories from fragments, let AI help turn your inspiration into reality"
                                    )}
                                </p>
                            </button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setStep("genres")}>
                                    Back
                                </Button>
                                <Button className="flex-1" onClick={finish} disabled={saving}>
                                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Finish
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
