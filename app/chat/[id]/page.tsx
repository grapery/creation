"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { chat, ChatMessage, ChatSession } from "@/lib/api/chat";
import { Header } from "@/components/layout/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatConversationPage() {
    const { id } = useParams();
    const router = useRouter();
    const [session, setSession] = useState<ChatSession | null>(null); // Ideally we fetch session details
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!id) return;
        async function init() {
            try {
                // Mock: We might need to fetch session info based on ID if it's not passed.
                // Assuming chat.getSession(id) exists or we use list.
                // For now, let's just fetch messages.
                const msgs = await chat.getMessages(id as string);
                setMessages(msgs.reverse()); // Assume API returns newest first? Or handle sorting.
                setLoading(false);
                scrollToBottom();
            } catch (e) {
                console.error(e);
            }
        }
        init();
    }, [id]);

    const scrollToBottom = () => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    const onSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || sending) return;

        const tempId = Date.now().toString();
        const newMsg: ChatMessage = {
            id: tempId,
            sessionId: id as string,
            role: "user",
            content: input,
            timestamp: Date.now(),
            status: "sending"
        };

        setMessages(prev => [...prev, newMsg]);
        setInput("");
        setSending(true);
        scrollToBottom();

        try {
            // Send to API
            const sentMsg = await chat.sendMessage(id as string, newMsg.content);

            // Replace temp msg
            setMessages(prev => prev.map(m => m.id === tempId ? { ...sentMsg, status: 'sent' } : m));

            // Simulate Assistant Reply (if not handled by backend immediately or socket)
            // Ideally backend returns reply or we poll. 
            // For now, let's assume we need to poll or wait.
            // Let's verify if 'sendMessage' returns just the user message or the whole context.
        } catch (e) {
            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: 'error' } : m));
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="fixed inset-0 flex flex-col bg-background">
            {/* Header */}
            <div className="border-b h-14 flex items-center px-4 bg-card z-10">
                <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.characterAvatar} />
                        <AvatarFallback>{session?.characterName?.[0] || "C"}</AvatarFallback>
                    </Avatar>
                    <div className="font-semibold">{session?.characterName || "Chat"}</div>
                </div>
            </div>

            {/* Messages */}
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
                            {msg.status === 'sending' && <span className="ml-2 opacity-50 text-[10px]">...</span>}
                            {msg.status === 'error' && <span className="ml-2 text-destructive text-[10px]">Error</span>}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-background border-t">
                <form onSubmit={onSend} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        autoFocus
                    />
                    <Button type="submit" size="icon" disabled={!input.trim() || sending}>
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </div>
    );
}
