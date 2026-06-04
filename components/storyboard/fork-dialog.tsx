"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, GitFork } from "lucide-react";
import { storyboards } from "@/lib/api/storyboards";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/providers/language-provider";
import { Textarea } from "@/components/ui/textarea";

interface ForkDialogProps {
    storyboardId: string;
    currentTitle?: string;
    open?: boolean;
    onClose?: () => void;
}

export function ForkDialog({ storyboardId, currentTitle, open, onClose }: ForkDialogProps) {
    const router = useRouter();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(`Fork of ${currentTitle || ""}`);
    const [rawInput, setRawInput] = useState("");

    if (open === false) return null;

    const handleFork = async () => {
        setLoading(true);
        try {
            const newStoryboard = await storyboards.fork(storyboardId, {
                title,
                rawInput,
            });
            onClose?.();
            router.push(`/storyboards/${newStoryboard.id}`);
        } catch (e) {
            console.error("Fork failed:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
                <GitFork className="h-5 w-5" />
                {t("storyboard.fork_title")}
            </div>
            <p className="text-sm text-muted-foreground">
                {t("storyboard.fork_description")}
            </p>
            <div className="space-y-2">
                <Label htmlFor="fork-title">{t("storyboard.fork_title_label")}</Label>
                <Input
                    id="fork-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title for the forked storyboard"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="fork-input">{t("storyboard.fork_direction")}</Label>
                <Textarea
                    id="fork-input"
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Describe how you want to diverge from the original..."
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={onClose}>{t("common.cancel")}</Button>
                <Button onClick={handleFork} disabled={loading || !title.trim()}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("storyboard.fork")}
                </Button>
            </div>
        </div>
    );
}
