"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { profile } from "@/lib/api/profile";
import { upload } from "@/lib/api/upload";

export default function ProfileSettingsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { language } = useTranslation();
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
            setErrorMessage(
                language === 'zh-Hans' ? '更新个人资料失败，请重试' :
                language === 'ja' ? 'プロフィールの更新に失敗しました。もう一度お試しください' :
                'Failed to update profile. Please try again.'
            );
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
                    {language === 'zh-Hans' ? '个人资料设置' : language === 'ja' ? 'プロフィール設定' : 'Profile Settings'}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {language === 'zh-Hans' ? '管理您的个人资料信息' : language === 'ja' ? 'プロフィール情報を管理' : 'Manage your profile information'}
                </p>
            </div>

            {/* Avatar Section */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-base font-semibold text-foreground mb-4">
                        {language === 'zh-Hans' ? '头像照片' : language === 'ja' ? 'プロフィール写真' : 'Profile Photo'}
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
                                {language === 'zh-Hans' ? '当前照片' : language === 'ja' ? '現在の写真' : 'Current Photo'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {language === 'zh-Hans' ? '点击相机图标更改' : language === 'ja' ? 'カメラをタップして変更' : 'Tap the camera to change'}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Basic Information Section */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-base font-semibold text-foreground mb-4">
                        {language === 'zh-Hans' ? '基本信息' : language === 'ja' ? '基本情報' : 'Basic Information'}
                    </h2>

                    {/* Display Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            {language === 'zh-Hans' ? '显示名称' : language === 'ja' ? '表示名' : 'Display Name'}
                        </label>
                        <Input
                            type="text"
                            placeholder={language === 'zh-Hans' ? '输入您的显示名称' : language === 'ja' ? '表示名を入力' : 'Enter your display name'}
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            {language === 'zh-Hans' ? '用户名' : language === 'ja' ? 'ユーザー名' : 'Username'}
                        </label>
                        <Input
                            type="text"
                            placeholder="username"
                            value={username}
                            disabled
                            className="w-full bg-muted/30 cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">
                            {language === 'zh-Hans' ? '用户名无法更改' : language === 'ja' ? 'ユーザー名は変更できません' : 'Username cannot be changed'}
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
                                placeholder={language === 'zh-Hans' ? '介绍一下你自己' : language === 'ja' ? '自己紹介をしてください' : 'Tell us about yourself'}
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
                            placeholder={language === 'zh-Hans' ? '城市，国家' : language === 'ja' ? '都市、国' : 'City, Country'}
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
                        {language === 'zh-Hans' ? 'AI 偏好设置' : language === 'ja' ? 'AI設定' : 'AI Preferences'}
                    </h2>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            {language === 'zh-Hans' ? 'AI 提示风格' : language === 'ja' ? 'AIプロンプトスタイル' : 'AI Prompt Style'}
                        </label>
                        <div className="flex gap-2">
                            {[
                                {
                                    value: "detailed",
                                    label: language === 'zh-Hans' ? '详细' : language === 'ja' ? '詳細' : 'Detailed',
                                    tag: "detailed"
                                },
                                {
                                    value: "balanced",
                                    label: language === 'zh-Hans' ? '平衡' : language === 'ja' ? 'バランス' : 'Balanced',
                                    tag: "balanced"
                                },
                                {
                                    value: "concise",
                                    label: language === 'zh-Hans' ? '简洁' : language === 'ja' ? '簡潔' : 'Concise',
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
                        {language === 'zh-Hans' ? '选择您偏好的 AI 生成内容详细程度' : language === 'ja' ? 'AI生成コンテンツの詳細レベルを選択' : 'Choose your preferred level of AI-generated content detail'}
                    </p>
                </CardContent>
            </Card>

            {/* Save Button */}
            <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-11 text-base font-semibold"
            >
                {isSaving ?
                    (language === 'zh-Hans' ? '保存中...' : language === 'ja' ? '保存中...' : 'Saving...') :
                    (language === 'zh-Hans' ? '保存更改' : language === 'ja' ? '変更を保存' : 'Save Changes')
                }
            </Button>

            {/* Success Message */}
            {showSuccess && (
                <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg flex items-center justify-center">
                    <span className="font-medium">
                        {language === 'zh-Hans' ? '个人资料更新成功！' : language === 'ja' ? 'プロフィールが正常に更新されました！' : 'Profile updated successfully!'}
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
                        {language === 'zh-Hans' ? '关闭' : language === 'ja' ? '閉じる' : 'Dismiss'}
                    </button>
                </div>
            )}
        </div>
    );
}
