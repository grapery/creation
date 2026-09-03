"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Square, Sparkles, Loader2, Eye, UploadCloud, AlertCircle } from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/language-provider";
import { showError, showSuccess } from "@/lib/toast-utils";
import { fragments } from "@/lib/api/fragments";
import {
    AgentCreationMessageRequest,
    AgentGenerationEventPayload,
    issueAgentAccessToken,
    streamCreationMessage,
} from "@/lib/api/agent";

interface ChatMessage {
    id: string;
    role: "user" | "assistant" | "status" | "error";
    text: string;
}

interface FragmentResult {
    fragmentId: string;
    content?: string;
    images: string[];
}

function uid(): string {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
    const router = useRouter();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [activity, setActivity] = useState<{ step: string; progress: number } | null>(null);
    const [result, setResult] = useState<FragmentResult | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [published, setPublished] = useState(false);

    const sessionIdRef = useRef<string>("");
    const draftIdRef = useRef<string>("");
    const abortRef = useRef<AbortController | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const sessionId = useCallback((): string => {
        if (!sessionIdRef.current) sessionIdRef.current = `cs_${uid()}`;
        return sessionIdRef.current;
    }, []);

    useEffect(() => () => abortRef.current?.abort(), []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages, activity, result]);

    const push = useCallback((role: ChatMessage["role"], text: string) => {
        setMessages((prev) => [...prev, { id: uid(), role, text }]);
    }, []);

    const handleEvent = useCallback(
        (event: string, data: AgentGenerationEventPayload) => {
            const draftId = data.draftFragmentId || data.draftId || data.fragmentId;
            if (draftId) draftIdRef.current = draftId;

            switch (event) {
                case "accepted":
                    setActivity({ step: t("create_chat.step_accepted", "Request accepted"), progress: 0.02 });
                    break;
                case "intent":
                    setActivity({
                        step: `${data.intent || ""}${data.imageCount ? ` · ${data.imageCount} images` : ""}`.trim(),
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
        // finalize 通过 ref 稳定引用，不进依赖
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [push, t]
    );

    const finalize = useCallback(
        async (data: AgentGenerationEventPayload) => {
            const fragmentId = data.draftFragmentId || data.draftId || data.fragmentId || draftIdRef.current;
            const outputImages = data.output?.imageUrls || data.result?.imageUrls || [];
            if (!fragmentId) {
                setResult({ fragmentId: "", images: outputImages });
                return;
            }
            draftIdRef.current = fragmentId;
            try {
                const frag = await fragments.get(fragmentId);
                setResult({
                    fragmentId,
                    content: frag.content,
                    images: frag.imageUrls?.length ? frag.imageUrls : outputImages,
                });
            } catch {
                // 详情拉取失败不阻断展示流内已带出的图
                setResult({ fragmentId, images: outputImages });
            }
        },
        []
    );

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
                agent: "fragment",
                operation: "generate",
                sessionId: sessionId(),
                maxImages: 4,
            });

            const body: AgentCreationMessageRequest = {
                message: text,
                clientRequestId: uid(),
                context: {
                    surface: draftIdRef.current ? "fragment_edit" : "fragment_create",
                    targetType: "fragment",
                    draftId: draftIdRef.current || null,
                },
                options: {
                    imageCount: 4,
                    consistencyLevel: "standard",
                },
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
    }, [input, isStreaming, push, handleEvent, sessionId, t]);

    const stop = useCallback(() => {
        abortRef.current?.abort();
    }, []);

    const publish = useCallback(async () => {
        if (!result?.fragmentId || isPublishing || published) return;
        setIsPublishing(true);
        try {
            await fragments.update(result.fragmentId, { isDraft: false });
            setPublished(true);
            showSuccess(t("create_chat.published", "Published"));
            router.push(`/fragments/${result.fragmentId}`);
        } catch (e) {
            showError(
                t("create_chat.publish_failed", "Publish failed"),
                e instanceof Error ? e.message : undefined
            );
        } finally {
            setIsPublishing(false);
        }
    }, [result, isPublishing, published, router, t]);

    return (
        <div className="max-w-3xl mx-auto flex flex-col min-h-[70vh]">
            {/* Header */}
            <div className="pb-4">
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    {t("create_chat.title", "AI Create")}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                    {t("create_chat.subtitle", "Describe your idea — the assistant drafts an illustrated fragment with you.")}
                </p>
            </div>

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
                        <p className="text-sm font-medium">{t("create_chat.result_title", "Your fragment is ready")}</p>
                        {result.content && (
                            <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">{result.content}</p>
                        )}
                        {result.images.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                                {result.images.map((url, i) => (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        key={`${url}-${i}`}
                                        src={url}
                                        alt={`fragment image ${i + 1}`}
                                        className="w-full aspect-square object-cover rounded-lg border border-border"
                                    />
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2 pt-1">
                            {result.fragmentId && (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={`/fragments/${result.fragmentId}`}>
                                        <Eye className="h-4 w-4" />
                                        {t("create_chat.view", "View")}
                                    </a>
                                </Button>
                            )}
                            {result.fragmentId && !published && (
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
