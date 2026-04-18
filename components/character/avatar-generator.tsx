"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Sparkles, User, Crop } from "lucide-react";
import { characters } from "@/lib/api/characters";
import { upload } from "@/lib/api/upload";

interface AvatarGeneratorProps {
    characterId: string;
    currentAvatar?: string;
    onAvatarUpdated?: (avatarUrl: string) => void;
}

export function AvatarGenerator({ characterId, currentAvatar, onAvatarUpdated }: AvatarGeneratorProps) {
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState(currentAvatar || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);
        try {
            const result = await upload.uploadAvatar(file);
            const updated = await characters.updateAvatar(characterId, result.url);
            setPreviewUrl(result.url);
            onAvatarUpdated?.(result.url);
        } catch (err) {
            console.error("Avatar upload failed:", err);
        } finally {
            setLoading(false);
        }
    }, [characterId, onAvatarUpdated]);

    const handleGenerateAvatar = useCallback(async () => {
        setGenerating(true);
        try {
            const result = await characters.generateAvatar(characterId);
            setPreviewUrl(result.avatarUrl);
            onAvatarUpdated?.(result.avatarUrl);
        } catch (err) {
            console.error("Avatar generation failed:", err);
        } finally {
            setGenerating(false);
        }
    }, [characterId, onAvatarUpdated]);

    const handleGeneratePortrait = useCallback(async () => {
        setGenerating(true);
        try {
            const result = await characters.generatePortrait(characterId);
            setPortraitUrl(result.portraitUrl);
        } catch (err) {
            console.error("Portrait generation failed:", err);
        } finally {
            setGenerating(false);
        }
    }, [characterId]);

    const handleUsePortraitAsAvatar = useCallback(async () => {
        if (!portraitUrl) return;
        setLoading(true);
        try {
            const result = await characters.usePortraitAsAvatar(characterId, portraitUrl);
            setPreviewUrl(result.avatarUrl);
            onAvatarUpdated?.(result.avatarUrl);
        } catch (err) {
            console.error("Failed to use portrait as avatar:", err);
        } finally {
            setLoading(false);
        }
    }, [characterId, portraitUrl, onAvatarUpdated]);

    const isLoading = loading || generating;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                    )}
                </div>
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                            {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Upload className="mr-1 h-3 w-3" />}
                            Upload
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleGenerateAvatar} disabled={isLoading}>
                            {generating ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                            AI Avatar
                        </Button>
                    </div>
                    <Button size="sm" variant="ghost" onClick={handleGeneratePortrait} disabled={isLoading}>
                        <Sparkles className="mr-1 h-3 w-3" />
                        Generate Full Portrait
                    </Button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </div>

            {portraitUrl && (
                <div className="border rounded-lg p-3 space-y-2">
                    <p className="text-sm font-medium">Generated Portrait</p>
                    <img src={portraitUrl} alt="Portrait" className="w-full max-w-xs rounded-lg" />
                    <Button size="sm" onClick={handleUsePortraitAsAvatar} disabled={loading}>
                        <Crop className="mr-1 h-3 w-3" />
                        Use as Avatar
                    </Button>
                </div>
            )}
        </div>
    );
}
