"use client";

import { useEffect, useState, useCallback } from "react";
import { settings } from "@/lib/api/settings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Palette, Check } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast-utils";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/providers/language-provider";
import { errorMessage } from "@/lib/utils";

export default function GenrePreferencesPage() {
    const { t } = useTranslation();
    const [catalog, setCatalog] = useState<{ key: string; label: string }[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [initialSelected, setInitialSelected] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load genre catalog and current preferences in parallel
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [catalogData, prefs] = await Promise.all([
                settings.getGenreCatalog(),
                settings.getGenrePreferences(),
            ]);
            setCatalog(catalogData.genres || []);
            const preferred = new Set(prefs.preferredGenres || []);
            setSelected(preferred);
            setInitialSelected(preferred);
        } catch (e) {
            console.error("Failed to load genre preferences:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        loadData().then(() => {});
        return () => { isMounted = false; };
    }, [loadData]);

    const toggleGenre = (key: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const hasChanges =
        selected.size !== initialSelected.size ||
        [...selected].some((key) => !initialSelected.has(key));

    const handleSave = async () => {
        setSaving(true);
        try {
            await settings.updateGenrePreferences(Array.from(selected));
            setInitialSelected(new Set(selected));
            showSuccess("Genre preferences updated!");
        } catch (e: unknown) {
            showError(errorMessage(e) || "Failed to save preferences.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Genre Preferences
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                    Select your favorite genres to personalize your discover feed.
                </p>
            </div>

            {/* Genre Grid Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                        Preferred Genres
                        {selected.size > 0 && (
                            <Badge variant="secondary">
                                {selected.size} selected
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {catalog.map((genre) => {
                            const isSelected = selected.has(genre.key);
                            return (
                                <button
                                    key={genre.key}
                                    onClick={() => toggleGenre(genre.key)}
                                    className={cn(
                                        "relative flex items-center justify-between h-11 rounded-lg border-2 px-4 transition-all text-left",
                                        isSelected
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-transparent border-border hover:border-primary/50"
                                    )}
                                >
                                    <span className="text-sm font-medium truncate">
                                        {genre.label}
                                    </span>
                                    {isSelected && (
                                        <Check className="w-4 h-4 flex-shrink-0 ml-2" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Save section */}
                    <div className="mt-6 flex items-center gap-4">
                        <Button onClick={handleSave} disabled={saving || !hasChanges}>
                            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Preferences
                        </Button>
                        {hasChanges && !saving && (
                            <span className="text-sm text-muted-foreground">
                                Unsaved changes
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
