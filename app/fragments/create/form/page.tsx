"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePlus, Wand2, X, Loader2, Send, Sparkles, Image as ImageIcon, MessageSquare } from "lucide-react";
import { fragments } from "@/lib/api/fragments";
import { upload } from "@/lib/api/upload";
import { FragmentStylePicker } from "@/components/fragment/fragment-style-picker";
import { FragmentVisibilityPicker } from "@/components/fragment/fragment-visibility-picker";
import { FragmentGenerationOverlay } from "@/components/fragment/fragment-generation-overlay";
import { showSuccess, showError } from "@/lib/toast-utils";
import { RequireAuth } from "@/components/auth/require-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FragmentStyle, FragmentVisibility, GenerateFragmentPanelsTaskResponse } from "@/lib/types";

type CreationMode = "ai-text" | "ref-image";

const ASPECT_RATIOS = [
    { value: "1:1", label: "1:1", desc: "Square" },
    { value: "3:4", label: "3:4", desc: "Portrait" },
    { value: "4:3", label: "4:3", desc: "Landscape" },
    { value: "9:16", label: "9:16", desc: "Tall" },
    { value: "16:9", label: "16:9", desc: "Wide" },
] as const;

const PANEL_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

function CreateFragmentForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [content, setContent] = useState("");
    const [caption, setCaption] = useState("");
    const [topic, setTopic] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<string>("");
    const [visibility, setVisibility] = useState<FragmentVisibility>("public");
    const [creationMode, setCreationMode] = useState<CreationMode>("ai-text");
    const [aspectRatio, setAspectRatio] = useState<string>("3:4");
    const [panelCount, setPanelCount] = useState<number>(1);

    const [styles, setStyles] = useState<FragmentStyle[]>([]);
    const [loadingStyles, setLoadingStyles] = useState(false);

    const [genStatus, setGenStatus] = useState<"idle" | "generating" | "polling" | "completed" | "failed">("idle");
    const [genProgress, setGenProgress] = useState("");
    const [genError, setGenError] = useState("");
    const [draftFragmentId, setDraftFragmentId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);


    useEffect(() => {
        loadStyles();
        loadDraft();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅挂载时加载画风与草稿
    }, []);

    const loadDraft = async () => {
        try {
            const params = new URLSearchParams(window.location.search);
            const draftId = params.get("draftId");
            if (!draftId) return;
            const frag = await fragments.get(draftId);
            if (frag && frag.isDraft) {
                setContent(frag.content);
                setCaption(frag.caption || "");
                setTopic(frag.topic || "");
                setImageUrls(frag.imageUrls || []);
                setSelectedStyle(frag.style || "");
                setDraftFragmentId(frag.id);
            }
        } catch {
            /* ignore */
        }
    };

    const loadStyles = async () => {
        setLoadingStyles(true);
        try {
            const res = await fragments.getStyles();
            setStyles(res.styles);
            if (res.styles.length > 0 && !selectedStyle) {
                setSelectedStyle(res.styles[0].value);
            }
        } catch (err) {
            console.error("Failed to load styles:", err);
        } finally {
            setLoadingStyles(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        for (const file of Array.from(files)) {
            try {
                const result = await upload.uploadImage(file);
                if (result.url) setImageUrls((prev) => [...prev, result.url]);
            } catch {
                showError("Image upload failed", "Please try again");
            }
        }
    };

    const removeImage = (index: number) => {
        setImageUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAIGenerate = async () => {
        if (!content.trim()) {
            showError("Content required", "Please enter some content or a prompt first");
            return;
        }
        setGenStatus("generating");
        setGenProgress("Starting AI generation...");
        try {
            const { taskId } = await fragments.generate({
                userInput: content,
                style: selectedStyle || undefined,
                visibility,
                language: "zh-Hans",
                imageCount: panelCount || 4,
                aspectRatio,
                targetDraftFragmentId: draftFragmentId || undefined,
            });
            setGenStatus("polling");
            setGenProgress("AI is creating your fragment...");
            const pollInterval = setInterval(async () => {
                try {
                    const result = await fragments.getGenerateStatus(taskId);
                    if (result.status === "completed" && result.result) {
                        clearInterval(pollInterval);
                        setGenStatus("completed");
                        if (result.result.id) setDraftFragmentId(result.result.id);
                        setContent(result.result.content || content);
                        setImageUrls(result.result.imageUrls || imageUrls);
                        showSuccess("AI Generation Complete", "Your fragment has been generated");
                    } else if (result.status === "failed") {
                        clearInterval(pollInterval);
                        setGenStatus("failed");
                        setGenError(result.error || "Generation failed");
                    }
                } catch {
                    /* continue */
                }
            }, 3000);
        } catch (err) {
            setGenStatus("failed");
            setGenError("Failed to start generation");
            console.error(err);
        }
    };

    const handlePanelGenerate = async () => {
        if (imageUrls.length === 0) {
            showError("Reference image required", "Please upload a reference image first");
            return;
        }
        if (!content.trim()) {
            showError("Description required", "Please describe what you want to generate");
            return;
        }
        setGenStatus("generating");
        setGenProgress("Generating panels from reference image...");
        try {
            const { taskId } = await fragments.generatePanels({
                userInput: content,
                referenceImageUrl: imageUrls[0],
                style: selectedStyle || undefined,
                panelCount: panelCount > 1 ? panelCount : undefined,
                aspectRatio: aspectRatio !== "3:4" ? aspectRatio : undefined,
                visibility,
                topic: topic || undefined,
            });
            setGenStatus("polling");
            setGenProgress("AI is creating panels...");
            const pollInterval = setInterval(async () => {
                try {
                    const result: GenerateFragmentPanelsTaskResponse =
                        await fragments.getPanelGenerateStatus(taskId);
                    if (result.status === "completed") {
                        clearInterval(pollInterval);
                        setGenStatus("completed");
                        const newUrls = result.panels?.map((p) => p.imageUrl) || [];
                        setImageUrls(newUrls);
                        showSuccess(
                            "Panel Generation Complete",
                            `${result.metrics?.panelsGenerated || newUrls.length} panels created`
                        );
                    } else if (result.status === "failed") {
                        clearInterval(pollInterval);
                        setGenStatus("failed");
                        setGenError(result.error || "Panel generation failed");
                    }
                } catch {
                    /* continue */
                }
            }, 3000);
        } catch (err) {
            setGenStatus("failed");
            setGenError("Failed to start panel generation");
            console.error(err);
        }
    };

    const handlePublish = async () => {
        if (!content.trim()) {
            showError("Content required", "Please add some content");
            return;
        }
        setSubmitting(true);
        try {
            if (draftFragmentId) {
                await fragments.update(draftFragmentId, {
                    content,
                    caption: caption || undefined,
                    imageUrls,
                    style: selectedStyle || undefined,
                    visibility,
                    topic: topic || undefined,
                    isDraft: false,
                });
            } else {
                await fragments.create({
                    content,
                    caption: caption || undefined,
                    imageUrls,
                    style: selectedStyle || undefined,
                    visibility,
                    topic: topic || undefined,
                });
            }
            showSuccess("Published!", "Your fragment has been published");
            router.push("/fragments");
        } catch (err) {
            showError("Publish failed", "Failed to publish fragment");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const generating = genStatus === "generating" || genStatus === "polling";


    return (
        <div className="container max-w-2xl mx-auto px-4 py-8 md:px-6 space-y-6">
            <FragmentGenerationOverlay
                status={genStatus}
                progress={genProgress}
                error={genError}
                onRetry={
                    genStatus === "failed"
                        ? creationMode === "ref-image"
                            ? handlePanelGenerate
                            : handleAIGenerate
                        : undefined
                }
            />

            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Create Fragment</h2>
                    <p className="text-muted-foreground text-sm">Share a creative moment</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/fragments/create">
                            <MessageSquare className="h-4 w-4 mr-1.5" />
                            Chat mode
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Close">
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Images</CardTitle>
                    <CardDescription>Optional reference or generated panels</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                        {imageUrls.map((url, i) => (
                            <div
                                key={url}
                                className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-border"
                            >
<Image src={url} alt="" fill sizes="120px" className="object-cover" />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white hover:bg-black/80 border-0"
                                    onClick={() => removeImage(i)}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-muted/50 transition-colors"
                        >
                            <ImagePlus className="w-5 h-5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Add</span>
                        </button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Options</CardTitle>
                    <CardDescription>Mode, layout, and generation settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <Label>Creation Mode</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {(
                                [
                                    {
                                        id: "ai-text" as const,
                                        icon: Sparkles,
                                        title: "AI Text",
                                        desc: "Describe → AI generates",
                                    },
                                    {
                                        id: "ref-image" as const,
                                        icon: ImageIcon,
                                        title: "Reference Image",
                                        desc: "Upload ref → AI panels",
                                    },
                                ] as const
                            ).map((mode) => (
                                <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() => setCreationMode(mode.id)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left",
                                        creationMode === mode.id
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/30"
                                    )}
                                >
                                    <mode.icon
                                        className={cn(
                                            "w-5 h-5",
                                            creationMode === mode.id ? "text-primary" : "text-muted-foreground"
                                        )}
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{mode.title}</p>
                                        <p className="text-sm text-muted-foreground">{mode.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Aspect Ratio</Label>
                        <div className="flex flex-wrap gap-2">
                            {ASPECT_RATIOS.map((ar) => (
                                <button
                                    key={ar.value}
                                    type="button"
                                    onClick={() => setAspectRatio(ar.value)}
                                    className={cn(
                                        "flex flex-col items-center px-3 py-2 rounded-lg border text-xs transition-colors",
                                        aspectRatio === ar.value
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-border text-muted-foreground hover:border-primary/30"
                                    )}
                                >
                                    <span className="font-medium">{ar.label}</span>
                                    <span className="text-[10px]">{ar.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Panels</Label>
                        <div className="flex flex-wrap gap-2">
                            {PANEL_COUNTS.map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setPanelCount(n)}
                                    className={cn(
                                        "w-9 h-9 rounded-lg border text-sm font-medium transition-colors",
                                        panelCount === n
                                            ? "border-primary bg-primary/5 text-primary"
                                            : "border-border text-muted-foreground hover:border-primary/30"
                                    )}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                        {panelCount > 1 && (
                            <p className="text-sm text-muted-foreground">
                                AI will generate {panelCount} connected panels in sequence
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Style</Label>
                        <FragmentStylePicker
                            styles={styles}
                            selected={selectedStyle}
                            onSelect={(s) => setSelectedStyle(s.value)}
                            loading={loadingStyles}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Visibility</Label>
                        <FragmentVisibilityPicker value={visibility} onChange={setVisibility} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fragment-content">Body</Label>
                        <Textarea
                            id="fragment-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your fragment content..."
                            rows={4}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fragment-caption">Caption (optional)</Label>
                        <Input
                            id="fragment-caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Add a caption..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fragment-topic">Topic</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">#</span>
                            <Input
                                id="fragment-topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value.replace(/^#/, ""))}
                                placeholder="topic"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    className="flex-1"
                    variant="secondary"
                    onClick={creationMode === "ai-text" ? handleAIGenerate : handlePanelGenerate}
                    disabled={
                        generating ||
                        !content.trim() ||
                        (creationMode === "ref-image" && imageUrls.length === 0)
                    }
                >
                    {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                    {creationMode === "ai-text"
                        ? "AI Generate"
                        : `Generate ${panelCount > 1 ? `${panelCount} Panels` : "Image"}`}
                </Button>
            </div>

            <div className="flex gap-3 pt-2 border-t">
                <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button className="flex-1" onClick={handlePublish} disabled={submitting || !content.trim()}>
                    {submitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4 mr-2" />
                    )}
                    {submitting ? "Publishing..." : "Publish"}
                </Button>
            </div>
        </div>
    );
}

export default function CreateFragmentFormPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
            <RequireAuth title="Sign in to create">
                <CreateFragmentForm />
            </RequireAuth>
        </Suspense>
    );
}

