"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Sparkles, Upload, Wand2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { characters } from "@/lib/api/characters";
import { upload } from "@/lib/api/upload";
import { CharacterGenerator } from "@/components/character/character-generator";
import { useTranslation } from "@/providers/language-provider";

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />;
}

export default function CreateCharacterPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [createMode, setCreateMode] = useState<"manual" | "ai">("manual");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        systemPrompt: "",
        isPublic: true,
        avatar: ""
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleAIGenerated = useCallback((generated: any) => {
        setFormData(prev => ({
            ...prev,
            name: generated.name || prev.name,
            description: generated.description || prev.description,
            systemPrompt: generated.systemPrompt || generated.personality || prev.systemPrompt,
        }));
    }, []);

    const onSubmit = async () => {
        setLoading(true);
        try {
            await characters.create(formData);
            router.push("/characters");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold">{t("characters.create_character")}</h1>
                <p className="text-muted-foreground">{t("characters.create_character_subtitle")}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t("characters.basic_info")}</CardTitle>
                    <CardDescription>{t("characters.basic_info_desc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs value={createMode} onValueChange={(v) => setCreateMode(v as "manual" | "ai")}>
                        <TabsList className="w-full">
                            <TabsTrigger value="manual" className="flex-1">Manual</TabsTrigger>
                            <TabsTrigger value="ai" className="flex-1">
                                <Wand2 className="h-3.5 w-3.5 mr-1.5" />
                                AI Generate
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="ai" className="mt-4">
                            <CharacterGenerator onGenerated={handleAIGenerated} />
                        </TabsContent>
                        <TabsContent value="manual" className="mt-0" />
                    </Tabs>

                    <div className="space-y-2">
                        <Label htmlFor="name">{t("characters.character_editor_name")}</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Sherlock Holmes"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="desc">{t("characters.character_editor_description")}</Label>
                        <Textarea
                            id="desc"
                            placeholder="A brief description visible to others..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="prompt">System Persona (Prompt)</Label>
                        <div className="relative">
                            <Textarea
                                id="prompt"
                                placeholder="You are a helpful assistant..."
                                className="min-h-[150px]"
                                value={formData.systemPrompt}
                                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Define how the character behaves in chat.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Avatar</Label>
                        <div
                            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Avatar" className="h-24 w-24 rounded-full object-cover" />
                            ) : (
                                <>
                                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                                        {avatarUploading ? (
                                            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                                        ) : (
                                            <Upload className="h-6 w-6 text-muted-foreground" />
                                        )}
                                    </div>
                                    <span className="text-sm text-muted-foreground">Upload Image</span>
                                </>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="ghost" onClick={() => router.back()}>{t("common.cancel")}</Button>
                    <Button onClick={onSubmit} disabled={loading || !formData.name.trim()}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t("characters.create_character")}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
