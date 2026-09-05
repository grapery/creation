"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Upload, X } from "lucide-react";
import { characters } from "@/lib/api/characters";
import { upload } from "@/lib/api/upload";
import { CharacterGenerator } from "@/components/character/character-generator";
import { showSuccess, showError } from "@/lib/toast-utils";
import { useTranslation } from "@/providers/language-provider";
import { Textarea } from "@/components/ui/textarea";
import type { Character } from "@/lib/types/character";

export default function EditCharacterPage() {
    const { id } = useParams();
    const router = useRouter();
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        personality: "",
        background: "",
        appearance: "",
        shortTermGoal: "",
        longTermGoal: "",
        abilityFeatures: "",
        dressPreference: "",
        traits: [] as string[],
        systemPrompt: "",
        avatar: "",
        isPublic: true,
    });

    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        if (!id) return;
        async function load() {
            try {
                const data: Character = await characters.get(id as string);
                setFormData({
                    name: data.name || "",
                    description: data.description || "",
                    personality: Array.isArray(data.personality) ? data.personality.join(", ") : (data.personality || ""),
                    background: data.background || "",
                    appearance: data.appearance || "",
                    shortTermGoal: data.shortTermGoal || "",
                    longTermGoal: data.longTermGoal || "",
                    abilityFeatures: data.abilityFeatures || "",
                    dressPreference: data.dressPreference || "",
                    traits: data.traits || [],
                    systemPrompt: data.systemPrompt || "",
                    avatar: data.avatar || "",
                    isPublic: data.isPublic ?? true,
                });
            } catch (e) {
                console.error(e);
                showError("Load failed", "Could not load character data");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarUploading(true);
        try {
            const result = await upload.uploadAvatar(file);
            setFormData(prev => ({ ...prev, avatar: result.url }));
        } catch (err) {
            console.error("Avatar upload failed:", err);
        } finally {
            setAvatarUploading(false);
        }
    }, []);

    const handleAIGenerated = useCallback((generated: Partial<Character>) => {
        setFormData(prev => ({
            ...prev,
            name: generated.name || prev.name,
            description: generated.description || prev.description,
            personality: generated.personality || prev.personality,
            background: generated.background || prev.background,
            systemPrompt: generated.systemPrompt || generated.personality || prev.systemPrompt,
        }) as typeof prev);
    }, []);

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !formData.traits.includes(tag)) {
            setFormData(prev => ({ ...prev, traits: [...prev.traits, tag] }));
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({ ...prev, traits: prev.traits.filter(t => t !== tag) }));
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            showError("Name required", "Character must have a name");
            return;
        }
        setSaving(true);
        try {
            await characters.update(id as string, {
                name: formData.name,
                description: formData.description,
                personality: formData.personality,
                background: formData.background,
                appearance: formData.appearance,
                shortTermGoal: formData.shortTermGoal,
                longTermGoal: formData.longTermGoal,
                abilityFeatures: formData.abilityFeatures,
                dressPreference: formData.dressPreference,
                traits: formData.traits,
                systemPrompt: formData.systemPrompt,
                avatar: formData.avatar,
                isPublic: formData.isPublic,
            });
            showSuccess("Saved!", "Character updated successfully");
            router.push(`/characters/${id}`);
        } catch (e) {
            console.error(e);
            showError("Save failed", "Could not save character");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t("characters.edit_character")}</h1>
                    <p className="text-muted-foreground text-sm">Update {formData.name}&apos;s profile</p>
                </div>
                <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4">
                <div
                    className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            {avatarUploading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            ) : (
                                <Upload className="w-6 h-6 text-muted-foreground" />
                            )}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium">Avatar</p>
                    <p className="text-xs text-muted-foreground">Click to upload a new avatar</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>

            {/* Two-tab editor */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger value="profile" className="flex-1">Profile & Background</TabsTrigger>
                    <TabsTrigger value="appearance" className="flex-1">Appearance & Goals</TabsTrigger>
                </TabsList>

                {/* Profile & Background Tab */}
                <TabsContent value="profile" className="mt-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Info</CardTitle>
                            <CardDescription>Core identity and personality</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t("characters.character_editor_name")}</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Character name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">{t("characters.character_editor_description")}</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="A brief description of the character..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="personality">Personality</Label>
                                <Textarea
                                    id="personality"
                                    value={formData.personality}
                                    onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                                    placeholder="Personality traits, e.g. brave, curious, kind..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="background">Background Story</Label>
                                <Textarea
                                    id="background"
                                    value={formData.background}
                                    onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                                    placeholder="Character's background and history..."
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>AI Persona</CardTitle>
                            <CardDescription>System prompt for character chat behavior</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="systemPrompt">System Prompt</Label>
                                <Textarea
                                    id="systemPrompt"
                                    value={formData.systemPrompt}
                                    onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                                    placeholder="You are a character who..."
                                    rows={5}
                                />
                            </div>

                            <div className="pt-2">
                                <CharacterGenerator onGenerated={handleAIGenerated} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Appearance & Goals Tab */}
                <TabsContent value="appearance" className="mt-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Physical traits and style</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="appearance">Appearance Description</Label>
                                <Textarea
                                    id="appearance"
                                    value={formData.appearance}
                                    onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
                                    placeholder="Hair color, eye color, build, distinguishing features..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dressPreference">Dress Style</Label>
                                <Textarea
                                    id="dressPreference"
                                    value={formData.dressPreference}
                                    onChange={(e) => setFormData({ ...formData, dressPreference: e.target.value })}
                                    placeholder="Preferred clothing style and accessories..."
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Goals & Abilities</CardTitle>
                            <CardDescription>What drives this character</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="shortTermGoal">Short-term Goal</Label>
                                <Input
                                    id="shortTermGoal"
                                    value={formData.shortTermGoal}
                                    onChange={(e) => setFormData({ ...formData, shortTermGoal: e.target.value })}
                                    placeholder="Immediate objective..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="longTermGoal">Long-term Goal</Label>
                                <Input
                                    id="longTermGoal"
                                    value={formData.longTermGoal}
                                    onChange={(e) => setFormData({ ...formData, longTermGoal: e.target.value })}
                                    placeholder="Ultimate ambition..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="abilityFeatures">Abilities</Label>
                                <Textarea
                                    id="abilityFeatures"
                                    value={formData.abilityFeatures}
                                    onChange={(e) => setFormData({ ...formData, abilityFeatures: e.target.value })}
                                    placeholder="Special skills and powers..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                            <CardDescription>Labels for discovery and categorization</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {formData.traits.map((tag) => (
                                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted rounded-full text-sm">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                    placeholder="Add a tag..."
                                    className="flex-1"
                                />
                                <Button variant="outline" onClick={addTag} disabled={!tagInput.trim()}>
                                    Add
                                </Button>
                            </div>

                            <div className="space-y-2 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label>Public Character</Label>
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isPublic ? "bg-primary" : "bg-muted"}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isPublic ? "translate-x-6" : "translate-x-1"}`} />
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                    {t("common.cancel")}
                </Button>
                <Button className="flex-1" onClick={handleSave} disabled={saving || !formData.name.trim()}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {saving ? t("common.saving") : t("common.save")}
                </Button>
            </div>
        </div>
    );
}
