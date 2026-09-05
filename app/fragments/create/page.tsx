"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Send, Sparkles, Check, ArrowLeft } from "lucide-react";
import { fragments } from "@/lib/api/fragments";
import { issueAgentAccessToken, streamCreationMessage } from "@/lib/api/agent";
import { RequireAuth } from "@/components/auth/require-auth";
import { useTranslation } from "@/providers/language-provider";
import { showError, showSuccess } from "@/lib/toast-utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatRole = "user" | "assistant" | "status";

interface ChatMessage {
    id: string;
    role: ChatRole;
    text: string;
}

function uid() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function pollUntilDone(taskId: string, onProgress: (msg: string) => void): Promise<{
    id?: string;
    content?: string;
    imageUrls?: string[];
}> {
    for (let i = 0; i < 90; i++) {
        await new Promise((r) => setTimeout(r, 2500));
        const status = await fragments.getGenerateStatus(taskId);
        onProgress(status.status === "processing" ? "Generating images…" : `Status: ${status.status}`);
        if (status.status === "completed" && status.result) {
            return {
                id: status.result.id,
                content: status.result.content,
                imageUrls: status.result.imageUrls,
            };
        }
        if (status.status === "failed") {
            throw new Error(status.error || "Generation failed");
        }
    }
    throw new Error("Generation timed out");
}

function CreateFragmentChat() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useTranslation();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            role: "assistant",
            text: "Describe a scene, mood, or story beat — I'll help plan and generate your fragment.",
        },
    ]);
    const [input, setInput] = useState("");
    const [busy, setBusy] = useState(false);
    const [draftId, setDraftId] = useState<string | null>(searchParams.get("draftId"));
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [previewContent, setPreviewContent] = useState("");
    const [publishing, setPublishing] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, previewUrls]);

    const pushMessage = (role: ChatRole, text: string) => {
        setMessages((prev) => [...prev, { id: uid(), role, text }]);
    };

    const runDirectGenerate = async (userInput: string, style?: string) => {
        pushMessage("status", "Starting generation…");
        const { taskId, draftFragmentId } = await fragments.generate({
            userInput,
            style: style || "fantasy",
            language: "zh-Hans",
            visibility: "private",
            imageCount: 4,
            aspectRatio: "9:16",
            targetDraftFragmentId: draftId || undefined,
            clientMessageId: uid(),
        });
        if (draftFragmentId) setDraftId(draftFragmentId);
        const result = await pollUntilDone(taskId, (msg) => {
            setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === "status") {
                    next[next.length - 1] = { ...last, text: msg };
                    return next;
                }
                return [...next, { id: uid(), role: "status", text: msg }];
            });
        });
        if (result.id) setDraftId(result.id);
        if (result.content) setPreviewContent(result.content);
        if (result.imageUrls?.length) setPreviewUrls(result.imageUrls);
        pushMessage("assistant", "Fragment draft is ready. Review below, then publish when you're happy.");
    };

    const handleSend = async () => {
        const text = input.trim();
        if (!text || busy) return;

        setInput("");
        pushMessage("user", text);
        setBusy(true);
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        try {
            // Planning via Grapery analyze (works without grapery-agent)
            pushMessage("status", "Planning…");
            let style = "fantasy";
            try {
                const plan = await fragments.analyze({
                    userInput: text,
                    language: "zh-Hans",
                    imageCount: 4,
                    aspectRatio: "9:16",
                    targetDraftFragmentId: draftId || undefined,
                });
                if (plan.assistantMessage) {
                    pushMessage("assistant", plan.assistantMessage);
                }
                style = plan.generationIntent?.style || plan.recommendedOptions?.styleCandidates?.[0] || style;
                if (plan.intentType === "chat_only" || plan.intentType === "ask_clarification") {
                    setBusy(false);
                    return;
                }
                if (plan.recommendedOptions?.canStart === false) {
                    setBusy(false);
                    return;
                }
            } catch {
                // Continue to generate even if analyze fails
            }

            // Prefer agent stream; fall back to Grapery generate+poll
            const sessionId = `cs_${uid()}`;
            let usedAgent = false;
            try {
                const token = await issueAgentAccessToken({
                    operation: "generate",
                    sessionId,
                    maxImages: 4,
                });
                pushMessage("status", "Generating with agent…");
                for await (const evt of streamCreationMessage(
                    sessionId,
                    token.agentAccessToken,
                    {
                        message: text,
                        clientRequestId: uid(),
                        context: {
                            surface: draftId ? "fragment_edit" : "fragment_create",
                            targetType: "fragment",
                            draftId,
                        },
                        options: {
                            imageCount: 4,
                            sceneCount: 4,
                            planningOnly: false,
                            style,
                            language: "zh-Hans",
                            visibility: "private",
                            aspectRatio: "9:16",
                            consistencyLevel: "standard",
                        },
                    },
                    ac.signal
                )) {
                    const payload = evt.data;
                    if (payload.assistantMessage) pushMessage("assistant", payload.assistantMessage);
                    if (payload.message && evt.event !== "error") {
                        setMessages((prev) => {
                            const next = [...prev];
                            const last = next[next.length - 1];
                            if (last?.role === "status") {
                                next[next.length - 1] = { ...last, text: payload.message || last.text };
                                return next;
                            }
                            return [...next, { id: uid(), role: "status", text: payload.message || "" }];
                        });
                    }
                    const id = payload.draftFragmentId || payload.draftId || payload.result?.id;
                    if (id) setDraftId(id);
                    if (payload.result?.content) setPreviewContent(payload.result.content);
                    if (payload.result?.imageUrls?.length) setPreviewUrls(payload.result.imageUrls);
                    if (payload.taskId && !payload.result) {
                        const result = await pollUntilDone(payload.taskId, (msg) => {
                            setMessages((prev) => {
                                const next = [...prev];
                                const last = next[next.length - 1];
                                if (last?.role === "status") {
                                    next[next.length - 1] = { ...last, text: msg };
                                    return next;
                                }
                                return [...next, { id: uid(), role: "status", text: msg }];
                            });
                        });
                        if (result.id) setDraftId(result.id);
                        if (result.content) setPreviewContent(result.content);
                        if (result.imageUrls?.length) setPreviewUrls(result.imageUrls);
                    }
                    if (payload.error || evt.event === "error") {
                        throw new Error(payload.error || payload.message || "Agent error");
                    }
                    usedAgent = true;
                }
            } catch (agentErr) {
                if (ac.signal.aborted) return;
                if (usedAgent && (previewUrls.length > 0 || draftId)) {
                    // Partial success
                } else {
                    console.warn("Agent unavailable, falling back to Grapery generate", agentErr);
                    pushMessage("status", "Agent unavailable — using direct generation…");
                    await runDirectGenerate(text, style);
                }
            }

            if (!previewUrls.length && !previewContent && draftId) {
                try {
                    const frag = await fragments.get(draftId);
                    if (frag.content) setPreviewContent(frag.content);
                    if (frag.imageUrls?.length) setPreviewUrls(frag.imageUrls);
                } catch {
                    /* ignore */
                }
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Failed to create fragment";
            showError(msg);
            pushMessage("assistant", `Something went wrong: ${msg}`);
        } finally {
            setBusy(false);
        }
    };

    const handlePublish = async () => {
        if (!draftId || publishing) return;
        setPublishing(true);
        try {
            await fragments.update(draftId, { isDraft: false, visibility: "public" });
            showSuccess("Published", "Your fragment is live");
            router.push(`/fragments/${draftId}`);
        } catch (e) {
            showError(e instanceof Error ? e.message : "Publish failed");
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4 gap-2">
                <div className="min-w-0">
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary shrink-0" />
                        {t("fragment.create_chat", "Create Fragment")}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Describe a scene — AI plans and generates</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/fragments/create/form">Form mode</Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                    </Button>
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pb-4 min-h-[40vh]">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`rounded-2xl px-4 py-3 text-sm max-w-[90%] ${
                            m.role === "user"
                                ? "ml-auto bg-primary text-primary-foreground"
                                : m.role === "status"
                                  ? "bg-muted/60 text-muted-foreground italic"
                                  : "bg-muted text-foreground"
                        }`}
                    >
                        {m.text}
                    </div>
                ))}

                {(previewContent || previewUrls.length > 0) && (
                    <div className="rounded-2xl border bg-card p-4 space-y-3">
                        {previewContent && (
                            <p className="text-sm whitespace-pre-wrap">{previewContent}</p>
                        )}
                        {previewUrls.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                                {previewUrls.map((url) => (
                                    <Image key={url} src={url} alt="" width={0} height={0} className="rounded-lg object-cover w-full aspect-[3/4] bg-muted" style={{ width: "100%", height: "auto" }} sizes="100vw" />
                                ))}
                            </div>
                        )}
                        {draftId && (
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/fragments/${draftId}`}>Open draft</Link>
                                </Button>
                                <Button size="sm" onClick={handlePublish} disabled={publishing}>
                                    {publishing ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Check className="h-4 w-4 mr-2" />
                                    )}
                                    Publish
                                </Button>
                            </div>
                        )}
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="sticky bottom-0 bg-background pt-2 border-t">
                <div className="flex gap-2 items-end">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your fragment idea…"
                        rows={2}
                        className="resize-none"
                        disabled={busy}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <Button onClick={handleSend} disabled={busy || !input.trim()} size="icon" className="h-10 w-10 shrink-0">
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function CreateFragmentChatPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
            <RequireAuth title="Sign in to create">
                <CreateFragmentChat />
            </RequireAuth>
        </Suspense>
    );
}

