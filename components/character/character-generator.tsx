"use client";

import { useState } from "react";
import type { Character } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { characters } from "@/lib/api/characters";
import { useTranslation } from "@/providers/language-provider";
import { Textarea } from "@/components/ui/textarea";

interface CharacterGeneratorProps {
    onGenerated?: (character: Partial<Character>) => void;
}

export function CharacterGenerator({ onGenerated }: CharacterGeneratorProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [generated, setGenerated] = useState<Partial<Character> | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const result = await characters.generate({ prompt });
            setGenerated(result);
            onGenerated?.(result);
        } catch (e) {
            console.error("Character generation failed:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>{t("characters.describe_your_character")}</Label>
                <div className="relative">
                    <Textarea
                        placeholder="e.g. A wise old wizard with a long beard who speaks in riddles..."
                        className="min-h-[100px] pr-24"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Button
                        size="sm"
                        className="absolute right-2 bottom-2"
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                    >
                        {loading ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                            <Wand2 className="mr-1 h-3 w-3" />
                        )}
                        {t("characters.ai_generate")}
                    </Button>
                </div>
            </div>

            {generated && (
                <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        {t("characters.generated_character")}
                    </div>
                    {generated.name && (
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{t("characters.character_editor_name")}</Label>
                            <p className="text-sm">{generated.name}</p>
                        </div>
                    )}
                    {generated.description && (
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{t("characters.character_editor_description")}</Label>
                            <p className="text-sm">{generated.description}</p>
                        </div>
                    )}
                    {generated.personality && (
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{t("characters.personality")}</Label>
                            <p className="text-sm">{Array.isArray(generated.personality) ? generated.personality.join(", ") : generated.personality}</p>
                        </div>
                    )}
                    {generated.appearance && (
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{t("characters.character_editor_appearance")}</Label>
                            <p className="text-sm">{generated.appearance}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
