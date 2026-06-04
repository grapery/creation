"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { profile } from "@/lib/api/profile";
import { upload } from "@/lib/api/upload";

export default function ProfileSettingsPage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Form state
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [website, setWebsite] = useState("");
    const [location, setLocation] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [aiPromptPreference, setAiPromptPreference] = useState<"detailed" | "balanced" | "concise">("detailed");

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
            setUsername(user.username || "");
            setEmail(user.email || "");
            setBio(user.bio || "");
            setWebsite(user.website || "");
            setLocation(user.location || "");
        }
    }, [user]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await profile.updateProfile({
                displayName: displayName.trim(),
                bio: bio.trim(),
                website: website.trim(),
                location: location.trim(),
            });

            // Handle avatar upload
            if (avatar) {
                const uploadResult = await upload.uploadImage(avatar);
                if (uploadResult.url) {
                    await profile.updateProfile({ avatar: uploadResult.url });
                }
            }

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (e) {
            console.error("Failed to save profile:", e);
            setErrorMessage(t('profile_settings.save_failed'));
            setShowError(true);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                    {t('profile_settings.title')}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {t('profile_settings.subtitle')}
                </p>
            </div>

            {/* Avatar Section */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-base font-semibold text-foreground mb-4">
                        {t('profile_settings.avatar')}
                    </h2>

                    <div className="flex items-center gap-6">
                        {/* Avatar Preview */}
                        <div className="relative">
                            <Avatar className="w-24 h-24">
                                {avatar ? (
                                    <AvatarImage src={URL.createObjectURL(avatar)} alt="Avatar" />
                                ) : (
                                    <AvatarFallback className="text-3xl font-bold">
                                        {(displayName || user?.username || "")[0]?.toUpperCase() || "?"}
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            {/* Upload Button Overlay */}
                            <label className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black/5 transition-colors rounded-full">
                                <Upload className="w-8 h-8 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="sr-only"
                                />
                            </label>
                        </div>

                        <div className="flex-1">
                            <div className="text-sm font-medium text-foreground mb-1">
                                {t('profile_settings.current_photo')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {t('profile_settings.click_camera_hint')}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Basic Information Section */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-base font-semibold text-foreground mb-4">
                        {t('profile_settings.basic_info')}
                    </h2>

                    {/* Display Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            {t('profile_settings.display_name')}
                        </label>
                        <Input
                            type="text"
                            placeholder={t('profile_settings.display_name_placeholder')}
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            {t('profile_settings.username')}
                        </label>
                        <Input
                            type="text"
                            placeholder="username"
                            value={username}
                            disabled
                            className="w-full bg-muted/30 cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">
                            {t('profile_settings.username_readonly')}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <Input
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Bio</label>
                        <div className="relative">
                            <textarea
                                placeholder={t('profile_settings.bio_placeholder')}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                className="w-full min-h-[80px] resize-none bg-secondary rounded-md px-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                {bio.length}/200
                            </div>
                        </div>
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Website</label>
                        <Input
                            type="url"
                            placeholder="https://yourwebsite.com"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Location</label>
                        <Input
                            type="text"
                            placeholder={t('profile_settings.location_placeholder')}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* AI Preferences Section */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-base font-semibold text-foreground mb-4">
                        {t('profile_settings.ai_preferences')}
                    </h2>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            {t('profile_settings.ai_prompt_style')}
                        </label>
                        <div className="flex gap-2">
                            {[
                                {
                                    value: "detailed",
                                    label: t('profile_settings.style_detailed'),
                                    tag: "detailed"
                                },
                                {
                                    value: "balanced",
                                    label: t('profile_settings.style_balanced'),
                                    tag: "balanced"
                                },
                                {
                                    value: "concise",
                                    label: t('profile_settings.style_concise'),
                                    tag: "concise"
                                },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setAiPromptPreference(option.value as any)}
                                    className={`
                                        flex-1 p-3 rounded-lg border ${aiPromptPreference === option.value
                                            ? "bg-primary text-white border-primary"
                                            : "bg-secondary border-border hover:border-primary/50"
                                        } transition-colors
                                    `}
                                >
                                    <div className="text-sm font-medium">
                                        {option.label}
                                    </div>
                                    {aiPromptPreference === option.value && (
                                        <div className="ml-auto">
                                            ✓
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                        {t('profile_settings.ai_style_desc')}
                    </p>
                </CardContent>
            </Card>

            {/* Save Button */}
            <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-11 text-base font-semibold"
            >
                {isSaving ? t('profile_settings.save_loading') : t('profile_settings.save_button')}
            </Button>

            {/* Success Message */}
            {showSuccess && (
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg flex items-center justify-center">
                    <span className="font-medium">
                        {t('profile_settings.save_success')}
                    </span>
                </div>
            )}

            {/* Error Message */}
            {showError && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
                    <p className="font-medium">{errorMessage}</p>
                    <button
                        onClick={() => {
                            setShowError(false);
                            setErrorMessage("");
                        }}
                        className="mt-2 text-xs underline"
                    >
                        {t('profile_settings.close')}
                    </button>
                </div>
            )}
        </div>
    );
}
