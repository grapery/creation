"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Send, Square, Sparkles, Loader2, Eye, UploadCloud, AlertCircle, Image as ImageIcon, Clapperboard, Settings2, Plus, X, RotateCcw } from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { showError, showSuccess } from "@/lib/toast-utils";
import { fragments } from "@/lib/api/fragments";
import { storyboards } from "@/lib/api/storyboards";
import { stories } from "@/lib/api/stories";
import { assets } from "@/lib/api/assets";
import { StyleConfig } from "@/lib/types";
import {
    AgentCreationMessageRequest,
    AgentGenerationEventPayload,
    issueAgentAccessToken,
    streamCreationMessage,
} from "@/lib/api/agent";

type CreationTarget = "fragment" | "storyboard";

interface ChatMessage {
    id: string;
    role: "user" | "assistant" | "status" | "error";
    text: string;
}

type CreationResult =
    | { kind: "fragment"; fragmentId: string; content?: string; images: string[] }
    | { kind: "storyboard"; storyboardId: string; content?: string; images: string[]; sceneCount?: number };

const MAX_REFERENCE_IMAGES = 3;
const MAX_HISTORY_MESSAGES = 40;

function uid(): string {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function historyKey(userId: string, target: CreationTarget): string {
    return `grapery:create_chat:${userId}:${target}`;
}

function clampProgress(value: number | undefined): number {
    if (value == null || Number.isNaN(value)) return 0;
    // 服务端 progress 为 0–1；容错处理 0–100
    const normalized = value > 1 ? value / 100 : value;
    return Math.min(Math.max(normalized, 0), 1);
}

export default function CreateChatPage() {
    return (
        <RequireAuth>
            <CreateChatContent />
        </RequireAuth>
    );
}

function CreateChatContent() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const router = useRouter();

    const [target, setTarget] = useState<CreationTarget>("fragment");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [activity, setActivity] = useState<{ step: string; progress: number } | null>(null);
    const [result, setResult] = useState<CreationResult | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [published, setPublished] = useState(false);

    // 创作选项
    const [showOptions, setShowOptions] = useState(false);
    const [imageCount, setImageCount] = useState(4);
    const [sceneCount, setSceneCount] = useState(3);
    const [styles, setStyles] = useState<StyleConfig[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<string>("");
    const [referenceImages, setReferenceImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const sessionIdRef = useRef<string>("");
    const draftRef = useRef<{ fragmentId: string; storyboardId: string }>({ fragmentId: "", storyboardId: "" });
    const abortRef = useRef<AbortController | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sessionId = useCallback((): string => {
        if (!sessionIdRef.current) sessionIdRef.current = `cs_${uid()}`;
        return sessionIdRef.current;
    }, []);

    // ---- 会话历史持久化（localStorage，按用户 + 目标隔离）----
    const userId = user?.id ?? "";

    useEffect(() => {
        if (!userId) return;
        try {
            const raw = localStorage.getItem(historyKey(userId, target));
            if (!raw) return;
            const saved = JSON.parse(raw) as { sessionId?: string; draftId?: string; messages?: ChatMessage[] };
            if (saved.sessionId) sessionIdRef.current = saved.sessionId;
            draftRef.current[target === "fragment" ? "fragmentId" : "storyboardId"] = saved.draftId || "";
            if (saved.messages?.length) setMessages(saved.messages);
        } catch {
            // 损坏的历史直接忽略
        }
    }, [userId, target]);

    useEffect(() => {
        if (!userId) return;
        const payload = JSON.stringify({
            sessionId: sessionIdRef.current,
            draftId: draftRef.current[target === "fragment" ? "fragmentId" : "storyboardId"],
            messages: messages.slice(-MAX_HISTORY_MESSAGES),
        });
        try {
            localStorage.setItem(historyKey(userId, target), payload);
        } catch {
            // 存储满等异常不打断创作
        }
    }, [userId, target, messages]);

    const resetConversation = useCallback(() => {
        draftRef.current = { fragmentId: "", storyboardId: "" };
        sessionIdRef.current = "";
        setMessages([]);
        setResult(null);
        setPublished(false);
        setActivity(null);
        setInput("");
        if (userId) {
            try {
                localStorage.removeItem(historyKey(userId, target));
            } catch {
                // ignore
            }
        }
    }, [userId, target]);

    // 切换目标 = 开启新创作会话
    const switchTarget = useCallback((next: CreationTarget) => {
        setTarget((prev) => {
            if (prev === next) return prev;
            resetConversation();
            setReferenceImages([]);
            setSelectedStyle("");
            return next;
        });
    }, [resetConversation]);

    // 画风列表懒加载（首次展开选项面板时拉取）
    const loadStyles = useCallback(async () => {
        if (styles.length > 0) return;
        try {
            const res = await stories.getStyles(20, 0);
            setStyles(res.styles || []);
        } catch {
            // 画风列表失败不阻断创作，仅禁用选择
        }
    }, [styles.length]);

    useEffect(() => () => abortRef.current?.abort(), []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages, activity, result]);

    const push = useCallback((role: ChatMessage["role"], text: string) => {
        setMessages((prev) => [...prev, { id: uid(), role, text }]);
    }, []);

    const handleEvent = useCallback(
        (event: string, data: AgentGenerationEventPayload) => {
            const fragmentId = data.draftFragmentId || data.draftId || data.fragmentId;
            if (fragmentId) draftRef.current.fragmentId = fragmentId;
            // progress/completed 事件不带 storyboardId，必须从 task_started 捕获
            const storyboardId = data.storyboardId || data.draftStoryboardId;
            if (storyboardId) draftRef.current.storyboardId = storyboardId;

            switch (event) {
                case "accepted":
                    setActivity({ step: t("create_chat.step_accepted", "Request accepted"), progress: 0.02 });
                    break;
                case "intent":
                    setActivity({
                        step:
                            target === "fragment"
                                ? `${data.intent || ""}${data.imageCount ? ` · ${data.imageCount} images` : ""}`.trim()
                                : `${data.intent || ""}${data.sceneCount ? ` · ${data.sceneCount} scenes` : ""}`.trim(),
                        progress: 0.05,
                    });
                    break;
                case "assistant_message":
                    if (data.message) push("assistant", data.message);
                    break;
                case "task_started":
                    setActivity({ step: t("create_chat.step_generating", "Generating"), progress: 0.1 });
                    break;
                case "progress": {
                    const step = data.currentStep || data.step || data.status || "";
                    setActivity({ step, progress: clampProgress(data.progress) });
                    break;
                }
                case "completed":
                    setActivity(null);
                    void finalize(data);
                    break;
                case "failed":
                    setActivity(null);
                    push("error", data.message || data.error || t("create_chat.failed", "Generation failed"));
                    break;
                default:
                    break;
            }
        },
        // finalize 经 ref 稳定，不进依赖
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [push, t, target]
    );

    const finalize = useCallback(
        async (data: AgentGenerationEventPayload) => {
            if (target === "fragment") {
                const fragmentId = data.draftFragmentId || data.draftId || data.fragmentId || draftRef.current.fragmentId;
                const outputImages = data.output?.imageUrls || data.result?.imageUrls || [];
                if (!fragmentId) {
                    setResult({ kind: "fragment", fragmentId: "", images: outputImages });
                    return;
                }
                draftRef.current.fragmentId = fragmentId;
                try {
                    const frag = await fragments.get(fragmentId);
                    setResult({
                        kind: "fragment",
                        fragmentId,
                        content: frag.content,
                        images: frag.imageUrls?.length ? frag.imageUrls : outputImages,
                    });
                } catch {
                    setResult({ kind: "fragment", fragmentId, images: outputImages });
                }
                return;
            }

            const storyboardId =
                data.storyboardId || data.draftStoryboardId || draftRef.current.storyboardId ||
                (typeof (data.output as Record<string, unknown> | undefined)?.storyboardId === "string"
                    ? (data.output as Record<string, unknown>).storyboardId as string
                    : "");
            if (!storyboardId) {
                push("status", t("create_chat.completed", "Generation completed."));
                return;
            }
            draftRef.current.storyboardId = storyboardId;
            try {
                const sb = await storyboards.get(storyboardId);
                const sceneImages = (sb.storyboardScenes || [])
                    .map((s) => s.image)
                    .filter((u): u is string => !!u);
                setResult({
                    kind: "storyboard",
                    storyboardId,
                    content: sb.content,
                    images: sb.images?.length ? sb.images : sceneImages,
                    sceneCount: sb.sceneCount ?? sb.storyboardScenes?.length,
                });
            } catch {
                setResult({ kind: "storyboard", storyboardId, images: [] });
            }
        },
        [push, t, target]
    );

    const uploadReferences = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const room = MAX_REFERENCE_IMAGES - referenceImages.length;
        if (room <= 0) {
            showError(t("create_chat.references_full", "Reference images are full"));
            return;
        }
        setIsUploading(true);
        try {
            const picked = Array.from(files).slice(0, room);
            const urls: string[] = [];
            for (const file of picked) {
                const res = await assets.uploadImage(file);
                if (res.url) urls.push(res.url);
            }
            if (urls.length > 0) setReferenceImages((prev) => [...prev, ...urls].slice(0, MAX_REFERENCE_IMAGES));
        } catch (e) {
            showError(t("create_chat.upload_failed", "Upload failed"), e instanceof Error ? e.message : undefined);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [referenceImages.length, t]);

    const send = useCallback(async () => {
        const text = input.trim();
        if (!text || isStreaming) return;

        setInput("");
        setResult(null);
        setPublished(false);
        push("user", text);
        setIsStreaming(true);
        setActivity({ step: t("create_chat.step_connecting", "Connecting"), progress: 0 });

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const token = await issueAgentAccessToken({
                agent: target,
                operation: "generate",
                sessionId: sessionId(),
                ...(target === "fragment" ? { maxImages: imageCount } : {}),
            });

            const draftId = target === "fragment" ? draftRef.current.fragmentId : draftRef.current.storyboardId;
            const body: AgentCreationMessageRequest = {
                message: text,
                clientRequestId: uid(),
                context:
                    target === "fragment"
                        ? {
                              surface: draftId ? "fragment_edit" : "fragment_create",
                              targetType: "fragment",
                              draftId: draftId || null,
                          }
                        : {
                              surface: draftId ? "storyboard_edit" : "storyboard_create",
                              targetType: "storyboard",
                              draftId: draftId || null,
                          },
                options:
                    target === "fragment"
                        ? {
                              imageCount,
                              consistencyLevel: "standard",
                              ...(selectedStyle ? { style: selectedStyle } : {}),
                              ...(referenceImages.length > 0 ? { referenceImages } : {}),
                          }
                        : { sceneCount },
            };

            for await (const ev of streamCreationMessage(sessionId(), token.agentAccessToken, body, controller.signal)) {
                handleEvent(ev.event, ev.data);
                if (controller.signal.aborted) break;
            }
        } catch (e) {
            if (!controller.signal.aborted) {
                push("error", e instanceof Error ? e.message : t("create_chat.error_stream", "Creation stream failed"));
            }
        } finally {
            setIsStreaming(false);
            setActivity(null);
            abortRef.current = null;
        }
    }, [input, isStreaming, push, handleEvent, sessionId, t, target, imageCount, sceneCount, selectedStyle, referenceImages]);

    const stop = useCallback(() => {
        abortRef.current?.abort();
    }, []);

    const publish = useCallback(async () => {
        if (!result || isPublishing || published) return;
        setIsPublishing(true);
        try {
            let href = "";
            if (result.kind === "fragment") {
                await fragments.update(result.fragmentId, { isDraft: false });
                href = `/fragments/${result.fragmentId}`;
            } else {
                await storyboards.publish(result.storyboardId);
                href = `/storyboards/${result.storyboardId}`;
            }
            setPublished(true);
            showSuccess(t("create_chat.published", "Published"));
            router.push(href);
        } catch (e) {
            showError(
                t("create_chat.publish_failed", "Publish failed"),
                e instanceof Error ? e.message : undefined
            );
        } finally {
            setIsPublishing(false);
        }
    }, [result, isPublishing, published, router, t]);

    const resultId = result ? (result.kind === "fragment" ? result.fragmentId : result.storyboardId) : "";
    const resultHref = result ? (result.kind === "fragment" ? `/fragments/${result.fragmentId}` : `/storyboards/${result.storyboardId}`) : "";

    return (
        <div className="max-w-3xl mx-auto flex flex-col min-h-[70vh]">
            {/* Header */}
            <div className="pb-3 flex items-start justify-between gap-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        {t("create_chat.title", "AI Create")}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        {t("create_chat.subtitle", "Describe your idea — the assistant drafts an illustrated fragment with you.")}
                    </p>
                </div>
                {messages.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={resetConversation} disabled={isStreaming} className="shrink-0">
                        <RotateCcw className="h-4 w-4" />
                        {t("create_chat.new_chat", "New")}
                    </Button>
                )}
            </div>

            {/* Target switcher + options toggle */}
            <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex gap-1 p-1 rounded-xl border border-border bg-card w-fit">
                    <button
                        type="button"
                        onClick={() => switchTarget("fragment")}
                        disabled={isStreaming}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                            target === "fragment" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <ImageIcon className="h-4 w-4" />
                        {t("create_chat.target_fragment", "Fragment")}
                    </button>
                    <button
                        type="button"
                        onClick={() => switchTarget("storyboard")}
                        disabled={isStreaming}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                            target === "storyboard" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Clapperboard className="h-4 w-4" />
                        {t("create_chat.target_storyboard", "Storyboard")}
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setShowOptions((v) => !v);
                        void loadStyles();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        showOptions ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <Settings2 className="h-4 w-4" />
                    {t("create_chat.options", "Options")}
                </button>
            </div>

            {/* Options panel */}
            {showOptions && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-4 mb-2">
                    {target === "fragment" ? (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{t("create_chat.image_count", "Images")}</span>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setImageCount((v) => Math.max(1, v - 1))} disabled={imageCount <= 1}>
                                        <Plus className="h-3.5 w-3.5 rotate-45" />
                                    </Button>
                                    <span className="w-6 text-center text-sm font-semibold">{imageCount}</span>
                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setImageCount((v) => Math.min(4, v + 1))} disabled={imageCount >= 4}>
                                        <Plus className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-sm font-medium">{t("create_chat.style", "Style")}</span>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedStyle("")}
                                        className={`shrink-0 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                                            !selectedStyle ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {t("create_chat.style_default", "Default")}
                                    </button>
                                    {styles.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setSelectedStyle(s.style || s.name)}
                                            className={`shrink-0 flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-lg border text-xs transition-colors ${
                                                selectedStyle === (s.style || s.name)
                                                    ? "border-primary text-primary bg-primary/5"
                                                    : "border-border text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            {s.preview_image ? (
                                                 
                                                <Image src={s.preview_image!} alt={s.name} width={24} height={24} sizes="24px" className="rounded object-cover" />
                                            ) : (
                                                <span className="h-6 w-6 rounded bg-muted" />
                                            )}
                                            <span className="max-w-24 truncate">{s.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{t("create_chat.references", "Reference images")}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {referenceImages.length}/{MAX_REFERENCE_IMAGES}
                                    </span>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {referenceImages.map((url, i) => (
                                        <div key={url} className="relative group">
                                            { }
                                            <Image src={url} alt={`reference ${i + 1}`} width={64} height={64} sizes="64px" className="rounded-lg object-cover border border-border" />
                                            <button
                                                type="button"
                                                onClick={() => setReferenceImages((prev) => prev.filter((u) => u !== url))}
                                                className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                aria-label="Remove"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {referenceImages.length < MAX_REFERENCE_IMAGES && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors disabled:opacity-50"
                                        >
                                            {isUploading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Plus className="h-4 w-4" />
                                                    <span className="text-[10px] mt-0.5">{t("create_chat.add", "Add")}</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => void uploadReferences(e.target.files)}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t("create_chat.scene_count", "Scenes")}</span>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setSceneCount((v) => Math.max(1, v - 1))} disabled={sceneCount <= 1}>
                                    <Plus className="h-3.5 w-3.5 rotate-45" />
                                </Button>
                                <span className="w-6 text-center text-sm font-semibold">{sceneCount}</span>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setSceneCount((v) => Math.min(8, v + 1))} disabled={sceneCount >= 8}>
                                    <Plus className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 space-y-3 py-2">
                {messages.length === 0 && !activity && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Sparkles className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-base font-medium mb-1">{t("create_chat.empty_title", "Tell me your idea")}</p>
                        <p className="text-sm text-muted-foreground">
                            {t("create_chat.empty_desc", "e.g. A stranger in a café on a rainy night")}
                        </p>
                    </div>
                )}

                {messages.map((m) => {
                    if (m.role === "user") {
                        return (
                            <div key={m.id} className="flex justify-end">
                                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-2.5 text-sm whitespace-pre-wrap">
                                    {m.text}
                                </div>
                            </div>
                        );
                    }
                    if (m.role === "assistant") {
                        return (
                            <div key={m.id} className="flex justify-start">
                                <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-card border border-border px-4 py-2.5 text-sm whitespace-pre-wrap">
                                    {m.text}
                                </div>
                            </div>
                        );
                    }
                    if (m.role === "error") {
                        return (
                            <div key={m.id} className="flex justify-center">
                                <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 border border-destructive/30 text-destructive px-3 py-1 text-xs">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {m.text}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div key={m.id} className="flex justify-center">
                            <span className="text-xs text-muted-foreground">{m.text}</span>
                        </div>
                    );
                })}

                {/* Live activity */}
                {activity && (
                    <div className="flex justify-center">
                        <div className="w-full max-w-md rounded-xl border border-border bg-card px-4 py-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                {activity.step || t("create_chat.step_generating", "Generating")}
                            </div>
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${Math.max(activity.progress * 100, 4)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Result card */}
                {result && (
                    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                        <p className="text-sm font-medium">
                            {result.kind === "fragment"
                                ? t("create_chat.result_title", "Your fragment is ready")
                                : t("create_chat.result_storyboard_title", "Your storyboard is ready")}
                            {result.kind === "storyboard" && result.sceneCount
                                ? ` · ${result.sceneCount} ${t("create_chat.scenes", "scenes")}`
                                : ""}
                        </p>
                        {result.content && (
                            <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">{result.content}</p>
                        )}
                        {result.images.length > 0 && (
                            <div className={`grid grid-cols-2 gap-2`}>
                                {result.images.map((url, i) => (
<Image key={`${url}-${i}`} src={url} alt={`${result.kind} image ${i + 1}`} width={0} height={0} sizes="(max-width: 768px) 50vw, 300px" style={{ width: "100%", height: "auto" }} className="aspect-square object-cover rounded-lg border border-border" />
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2 pt-1">
                            {resultId && (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={resultHref}>
                                        <Eye className="h-4 w-4" />
                                        {t("create_chat.view", "View")}
                                    </a>
                                </Button>
                            )}
                            {resultId && !published && (
                                <Button size="sm" onClick={publish} disabled={isPublishing}>
                                    <UploadCloud className="h-4 w-4" />
                                    {isPublishing
                                        ? t("create_chat.publishing", "Publishing…")
                                        : t("create_chat.publish", "Publish")}
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="sticky bottom-0 pt-2 pb-4 bg-background">
                {referenceImages.length > 0 && target === "fragment" && !showOptions && (
                    <div className="flex gap-1.5 mb-2">
                        {referenceImages.map((url) => (
                             
                            <Image key={url} src={url} alt="reference" width={36} height={36} sizes="36px" className="rounded-md object-cover border border-border" />
                        ))}
                    </div>
                )}
                <div className="flex items-end gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                void send();
                            }
                        }}
                        placeholder={t("create_chat.placeholder", "Describe the story you imagine…")}
                        rows={2}
                        disabled={isStreaming}
                        className="flex-1 resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                    />
                    {isStreaming ? (
                        <Button variant="outline" size="icon" className="h-11 w-11 shrink-0" onClick={stop} aria-label="Stop">
                            <Square className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            size="icon"
                            className="h-11 w-11 shrink-0"
                            onClick={() => void send()}
                            disabled={!input.trim()}
                            aria-label="Send"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">
                    {t("create_chat.hint", "Enter to send · Shift+Enter for a new line")}
                </p>
            </div>
        </div>
    );
}
