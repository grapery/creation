"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { chat, ChatMessage, ChatSession } from "@/lib/api/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatConversationPage() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const characterIdParam = searchParams.get("characterId");
    const peerUserIdParam = searchParams.get("peerUserId");

    const [session, setSession] = useState<ChatSession | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        async function init() {
            setLoading(true);
            try {
                let sid = id as string;

                // /chat/new?characterId= or ?peerUserId= → start session then rewrite URL
                if (sid === "new" || characterIdParam || peerUserIdParam) {
                    if (characterIdParam) {
                        const s = await chat.startSession(characterIdParam);
                        if (cancelled) return;
                        setSession(s);
                        sid = s.id;
                        router.replace(`/chat/${s.id}`);
                    } else if (peerUserIdParam) {
                        const s = await chat.startDirectSession(peerUserIdParam);
                        if (cancelled) return;
                        setSession(s);
                        sid = s.id;
                        router.replace(`/chat/${s.id}`);
                    } else if (sid !== "new") {
                        // Treat path id as characterId for legacy /chat/{characterId} links
                        try {
                            const existing = await chat.getSession(sid);
                            if (cancelled) return;
                            setSession(existing);
                        } catch {
                            const s = await chat.startSession(sid);
                            if (cancelled) return;
                            setSession(s);
                            sid = s.id;
                            router.replace(`/chat/${s.id}`);
                        }
                    }
                } else {
                    const s = await chat.getSession(sid);
                    if (cancelled) return;
                    setSession(s);
                }

                setSessionId(sid);
                const msgs = await chat.getMessages(sid);
                if (cancelled) return;
                // API returns newest first
                setMessages([...msgs].reverse());
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        init();
        return () => { cancelled = true; };
    }, [id, characterIdParam, peerUserIdParam, router]);

    const scrollToBottom = () => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages.length]);

    const onSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || sending || !sessionId) return;

        const tempId = Date.now().toString();
        const content = input.trim();
        const newMsg: ChatMessage = {
            id: tempId,
            sessionId,
            role: "user",
            content,
            timestamp: Date.now(),
            status: "sending",
        };

        setMessages(prev => [...prev, newMsg]);
        setInput("");
        setSending(true);

        try {
            const result = await chat.sendMessage(sessionId, content);
            setMessages(prev => {
                const withoutTemp = prev.filter(m => m.id !== tempId);
                const next = [...withoutTemp, { ...result.userMessage, status: "sent" as const }];
                if (result.assistantMessage) {
                    next.push({ ...result.assistantMessage, status: "sent" });
                }
                return next;
            });
        } catch (err) {
            console.error(err);
            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: "error" } : m));
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    const displayName = session?.characterName || session?.title || "Chat";
    const displayAvatar = session?.characterAvatar || session?.avatar;

    return (
        <div className="fixed inset-0 flex flex-col bg-background">
            <div className="border-b h-14 flex items-center px-4 bg-card z-10">
                <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/chat")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={displayAvatar} />
                        <AvatarFallback>{displayName?.[0] || "C"}</AvatarFallback>
                    </Avatar>
                    <div className="font-semibold">{displayName}</div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex w-full",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[80%] px-4 py-2 rounded-2xl text-sm",
                                msg.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                                    : "bg-muted text-foreground rounded-tl-sm"
                            )}
                        >
                            {msg.content}
                            {msg.status === "sending" && <span className="ml-2 opacity-50 text-[10px]">...</span>}
                            {msg.status === "error" && <span className="ml-2 text-destructive text-[10px]">Error</span>}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={onSend} className="border-t p-3 flex gap-2 bg-card">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message…"
                    disabled={sending || !sessionId}
                />
                <Button type="submit" size="icon" disabled={sending || !input.trim() || !sessionId}>
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </form>
        </div>
    );
}
