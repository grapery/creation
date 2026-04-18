"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { storyboards } from "@/lib/api/storyboards";
import { Storyboard } from "@/lib/types";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast-utils";

// Inline components if not created
function SimpleLabel({ children, htmlFor }: { children: React.ReactNode, htmlFor?: string }) {
    return <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{children}</label>
}

function SimpleTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
}

export default function EditorPage() {
    const { id } = useParams();
    const router = useRouter();
    const [parent, setParent] = useState<Storyboard | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        type: "scene"
    });
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (!id) return;
        async function load() {
            try {
                // If ID is 'new', we might need query param for parentId.
                // But route is [id]/editor. Usually this means editing [id].
                // To create a branch FROM [id], maybe route should be different or we handle "branch from X".
                // Let's assume we are maintaining a new branch from this ID.
                // Or editing this ID.
                // For now, let's assume this page is "Create Branch from [id]"
                const data = await storyboards.get(id as string);
                setParent(data);
                setFormData(prev => ({ ...prev, title: `Branch of ${data.title}` }));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const onSave = async () => {
        if (!parent) return;
        setSaving(true);
        try {
            const result = await storyboards.fork(parent.id, {
                title: formData.title,
                rawInput: formData.content,
            });
            showSuccess("Branch saved successfully");
            router.push(`/storyboards/${result.id}`);
        } catch (e: any) {
            console.error(e);
            showError(e.message || "Failed to save branch");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
    if (!parent) return <div className="flex justify-center py-20">Parent node not found</div>;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container max-w-2xl px-4 py-8 mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">New Branch</h1>
                    <Button onClick={onSave} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Branch
                    </Button>
                </div>

                <Card>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <SimpleLabel htmlFor="parent">Parent Scene</SimpleLabel>
                            <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground border">
                                {parent.title}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <SimpleLabel htmlFor="title">Title</SimpleLabel>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <SimpleLabel htmlFor="content">Content</SimpleLabel>
                            <SimpleTextarea
                                id="content"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write your story segment..."
                                rows={8}
                            />
                        </div>

                        {/* Image Generation */}
                        <button
                            onClick={async () => {
                                if (!parent) return;
                                setGenerating(true);
                                try {
                                    await storyboards.generateImage(parent.id, { sceneIndex: 0 });
                                    showSuccess("Image generation started");
                                } catch (e: any) {
                                    showError(e.message || "Failed to generate image");
                                } finally {
                                    setGenerating(false);
                                }
                            }}
                            disabled={generating || !formData.content}
                            className="w-full p-4 border border-dashed rounded-lg text-center cursor-pointer hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {generating ? (
                                <><Loader2 className="inline w-4 h-4 mr-2 animate-spin" /><span className="text-sm font-medium">Generating...</span></>
                            ) : (
                                <>
                                    <div className="text-sm font-medium">Generate Image (AI)</div>
                                    <div className="text-xs text-muted-foreground mt-1">Click to generate scene visualization</div>
                                </>
                            )}
                        </button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
