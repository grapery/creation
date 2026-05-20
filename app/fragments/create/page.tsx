"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Wand2, X, Loader2, Send, Sparkles, Image as ImageIcon } from "lucide-react";
import { fragments } from "@/lib/api/fragments";
import { FragmentStylePicker } from "@/components/fragment/fragment-style-picker";
import { FragmentVisibilityPicker } from "@/components/fragment/fragment-visibility-picker";
import { FragmentGenerationOverlay } from "@/components/fragment/fragment-generation-overlay";
import { showSuccess, showError } from "@/lib/toast-utils";
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

export default function CreateFragmentPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [content, setContent] = useState("");
    const [caption, setCaption] = useState("");
    const [topic, setTopic] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<string>("");
    const [visibility, setVisibility] = useState<FragmentVisibility>("public");
    const [creationMode, setCreationMode] = useState<CreationMode>("ai-text");
    const [aspectRatio, setAspectRatio] = useState<string>("3:4");
    const [panelCount, setPanelCount] = useState<number>(1);
    const [draftLoaded, setDraftLoaded] = useState(false);

    // Styles
    const [styles, setStyles] = useState<FragmentStyle[]>([]);
    const [loadingStyles, setLoadingStyles] = useState(false);

    // AI Generation
    const [genStatus, setGenStatus] = useState<"idle" | "generating" | "polling" | "completed" | "failed">("idle");
    const [genProgress, setGenProgress] = useState("");
    const [genError, setGenError] = useState("");
    const [draftFragmentId, setDraftFragmentId] = useState<string | null>(null);

    // Submit
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadStyles();
        loadDraft();
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
                setDraftLoaded(true);
            }
        } catch {
            // Draft not found or not a draft, continue with empty form
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

        // For now, convert to data URLs for preview
        // In production, upload to server and get URLs back
        for (const file of Array.from(files)) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const url = ev.target?.result as string;
                setImageUrls(prev => [...prev, url]);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    // AI text generation
    const handleAIGenerate = async () => {
        if (!content.trim()) {
            showError("Content required", "Please enter some content or a prompt first");
            return;
        }
        setGenStatus("generating");
        setGenProgress("Starting AI generation...");
        try {
            const { taskId } = await fragments.generate({
                content,
                style: selectedStyle || undefined,
                visibility,
                topic: topic || undefined,
            });

            // Poll for result
            setGenStatus("polling");
            setGenProgress("AI is creating your fragment...");
            const pollInterval = setInterval(async () => {
                try {
                    const result = await fragments.getGenerateStatus(taskId);
                    if (result.status === "completed" && result.result) {
                        clearInterval(pollInterval);
                        setGenStatus("completed");
                        if (result.result.id) {
                            setDraftFragmentId(result.result.id);
                        }
                        setContent(result.result.content || content);
                        setImageUrls(result.result.imageUrls || imageUrls);
                        showSuccess("AI Generation Complete", "Your fragment has been generated");
                    } else if (result.status === "failed") {
                        clearInterval(pollInterval);
                        setGenStatus("failed");
                        setGenError(result.error || "Generation failed");
                    }
                } catch {
                    // continue polling
                }
            }, 3000);
        } catch (err) {
            setGenStatus("failed");
            setGenError("Failed to start generation");
            console.error(err);
        }
    };

    // AI panel generation from reference image
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
                    const result: GenerateFragmentPanelsTaskResponse = await fragments.getPanelGenerateStatus(taskId);
                    if (result.status === "completed") {
                        clearInterval(pollInterval);
                        setGenStatus("completed");
                        const newUrls = result.panels?.map(p => p.imageUrl) || [];
                        setImageUrls(newUrls);
                        showSuccess("Panel Generation Complete", `${result.metrics?.panelsGenerated || newUrls.length} panels created`);
                    } else if (result.status === "failed") {
                        clearInterval(pollInterval);
                        setGenStatus("failed");
                        setGenError(result.error || "Panel generation failed");
                    }
                } catch {
                    // continue polling
                }
            }, 3000);
        } catch (err) {
            setGenStatus("failed");
            setGenError("Failed to start panel generation");
            console.error(err);
        }
    };

    // Publish fragment
    const handlePublish = async () => {
        if (!content.trim()) {
            showError("Content required", "Please add some content");
            return;
        }
        setSubmitting(true);
        try {
            if (draftFragmentId) {
                // Update existing draft
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
                // Create new
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

    return (
        <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
            <FragmentGenerationOverlay
                status={genStatus}
                progress={genProgress}
                error={genError}
                onRetry={genStatus === "failed" ? handleAIGenerate : undefined}
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Fragment</h1>
                    <p className="text-muted-foreground text-sm">Share a creative moment</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Images</label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {imageUrls.map((url, i) => (
                        <div key={i} className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-border">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeImage(i)}
                                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                            >
                                <X className="w-3 h-3 text-white" />
                            </button>
                        </div>
                    ))}
                    <button
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
            </div>

            {/* Creation Mode */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Creation Mode</label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setCreationMode("ai-text")}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                            creationMode === "ai-text"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/30"
                        }`}
                    >
                        <Sparkles className={`w-5 h-5 ${creationMode === "ai-text" ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="text-left">
                            <p className="text-sm font-medium">AI Text</p>
                            <p className="text-xs text-muted-foreground">Describe → AI generates</p>
                        </div>
                    </button>
                    <button
                        onClick={() => setCreationMode("ref-image")}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                            creationMode === "ref-image"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/30"
                        }`}
                    >
                        <ImageIcon className={`w-5 h-5 ${creationMode === "ref-image" ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="text-left">
                            <p className="text-sm font-medium">Reference Image</p>
                            <p className="text-xs text-muted-foreground">Upload ref → AI panels</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Aspect Ratio</label>
                <div className="flex gap-2">
                    {ASPECT_RATIOS.map((ar) => (
                        <button
                            key={ar.value}
                            onClick={() => setAspectRatio(ar.value)}
                            className={`flex flex-col items-center px-3 py-2 rounded-lg border text-xs transition-colors ${
                                aspectRatio === ar.value
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border text-muted-foreground hover:border-primary/30"
                            }`}
                        >
                            <span className="font-medium">{ar.label}</span>
                            <span className="text-[10px]">{ar.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Panel Count */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Panels</label>
                <div className="flex gap-2">
                    {PANEL_COUNTS.map((n) => (
                        <button
                            key={n}
                            onClick={() => setPanelCount(n)}
                            className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${
                                panelCount === n
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border text-muted-foreground hover:border-primary/30"
                            }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
                {panelCount > 1 && (
                    <p className="text-xs text-muted-foreground">
                        AI will generate {panelCount} connected panels in sequence
                    </p>
                )}
            </div>

            {/* Content */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your fragment content..."
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                />
            </div>

            {/* Caption */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Caption (optional)</label>
                <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a caption..."
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
            </div>

            {/* Topic */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">#</span>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value.replace(/^#/, ""))}
                        placeholder="topic"
                        className="flex-1 px-3 py-2.5 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                </div>
            </div>

            {/* Comic Style */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Style</label>
                <FragmentStylePicker
                    styles={styles}
                    selected={selectedStyle}
                    onSelect={(s) => setSelectedStyle(s.value)}
                    loading={loadingStyles}
                />
            </div>

            {/* Visibility */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Visibility</label>
                <FragmentVisibilityPicker value={visibility} onChange={setVisibility} />
            </div>

            {/* AI Actions */}
            <div className="flex gap-3">
                {creationMode === "ai-text" ? (
                    <button
                        onClick={handleAIGenerate}
                        disabled={genStatus === "generating" || genStatus === "polling" || !content.trim()}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
                    >
                        {genStatus === "generating" || genStatus === "polling" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Wand2 className="w-4 h-4" />
                        )}
                        AI Generate
                    </button>
                ) : (
                    <button
                        onClick={handlePanelGenerate}
                        disabled={genStatus === "generating" || genStatus === "polling" || imageUrls.length === 0 || !content.trim()}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
                    >
                        {genStatus === "generating" || genStatus === "polling" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Wand2 className="w-4 h-4" />
                        )}
                        Generate {panelCount > 1 ? `${panelCount} Panels` : "Image"}
                    </button>
                )}
            </div>

            {/* Publish */}
            <div className="flex gap-3 pt-4 border-t">
                <button
                    onClick={() => router.back()}
                    className="flex-1 py-3 border border-border bg-background hover:bg-muted text-foreground font-medium rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handlePublish}
                    disabled={submitting || !content.trim()}
                    className="flex-1 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                    {submitting ? "Publishing..." : "Publish"}
                </button>
            </div>
        </div>
    );
}
