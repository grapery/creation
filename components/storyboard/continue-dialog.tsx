"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";
import { storyboards } from "@/lib/api/storyboards";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/providers/language-provider";

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />;
}

interface ContinueDialogProps {
    storyboardId: string;
    open?: boolean;
    onClose?: () => void;
}

export function ContinueDialog({ storyboardId, open, onClose }: ContinueDialogProps) {
    const router = useRouter();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [rawInput, setRawInput] = useState("");
    const [sceneCount, setSceneCount] = useState(3);

    if (open === false) return null;

    const handleContinue = async () => {
        setLoading(true);
        try {
            const result = await storyboards.continue_(storyboardId, {
                rawInput,
                sceneCount,
            });
            onClose?.();
            if (result.newStoryboard?.id) {
                router.push(`/storyboards/${result.newStoryboard.id}`);
            }
        } catch (e) {
            console.error("Continue failed:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
                <ArrowRight className="h-5 w-5" />
                {t("storyboard.continue_title")}
            </div>
            <p className="text-sm text-muted-foreground">
                {t("storyboard.continue_description")}
            </p>
            <div className="space-y-2">
                <Label htmlFor="continue-input">{t("storyboard.continue_what_next")}</Label>
                <Textarea
                    id="continue-input"
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Describe the next chapter of the story..."
                    className="min-h-[120px]"
                />
            </div>
            <div className="space-y-2">
                <Label>{t("storyboard.continue_scene_count")}</Label>
                <div className="flex gap-2">
                    {[2, 3, 4, 5].map((n) => (
                        <Button
                            key={n}
                            size="sm"
                            variant={sceneCount === n ? "default" : "outline"}
                            onClick={() => setSceneCount(n)}
                        >
                            {n}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={onClose}>{t("common.cancel")}</Button>
                <Button onClick={handleContinue} disabled={loading || !rawInput.trim()}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("stories.continue_story")}
                </Button>
            </div>
        </div>
    );
}
