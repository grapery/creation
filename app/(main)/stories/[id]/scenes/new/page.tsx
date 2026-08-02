"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft } from "lucide-react";
import { stories } from "@/lib/api/stories";
import { RequireAuth } from "@/components/auth/require-auth";
import { useTranslation } from "@/providers/language-provider";
import { showError, showSuccess } from "@/lib/toast-utils";

function NewStorySceneForm() {
    const { id: storyId } = useParams<{ id: string }>();
    const router = useRouter();
    const { t } = useTranslation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [timeOfDay, setTimeOfDay] = useState("");
    const [submitting, setSubmitting] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!storyId || !title.trim()) {
            showError("Title is required");
            return;
        }
        setSubmitting(true);
        try {
            await stories.createScene(storyId, {
                title: title.trim(),
                description: description.trim() || undefined,
                location: location.trim() || undefined,
                timeOfDay: timeOfDay.trim() || undefined,
                sourceType: "manual",
                isPublic: true,
            });
            showSuccess(t("story_detail.scene_created", "Scene created"));
            router.push(`/stories/${storyId}?tab=scenes`);
        } catch (err: unknown) {
            showError(err instanceof Error ? err.message : "Failed to create scene");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="container max-w-2xl px-4 py-8 md:px-6 mx-auto">
            <Button
                variant="ghost"
                size="sm"
                className="mb-4"
                onClick={() => router.push(`/stories/${storyId}?tab=scenes`)}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("common.back", "Back")}
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>{t("story_detail.empty.add_scene", "Add Scene")}</CardTitle>
                    <CardDescription>
                        {t(
                            "story_detail.empty.no_scenes_message",
                            "Add scenes to structure your story"
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t("common.title", "Title")}</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Scene title"
                                maxLength={200}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">{t("common.description", "Description")}</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What happens in this scene?"
                                rows={4}
                                maxLength={4000}
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Optional"
                                    maxLength={100}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timeOfDay">Time of day</Label>
                                <Input
                                    id="timeOfDay"
                                    value={timeOfDay}
                                    onChange={(e) => setTimeOfDay(e.target.value)}
                                    placeholder="e.g. dusk"
                                    maxLength={50}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/stories/${storyId}?tab=scenes`)}
                            >
                                {t("common.cancel", "Cancel")}
                            </Button>
                            <Button type="submit" disabled={submitting || !title.trim()}>
                                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                {t("common.create", "Create")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}

export default function NewStoryScenePage() {
    return (
        <RequireAuth>
            <NewStorySceneForm />
        </RequireAuth>
    );
}

