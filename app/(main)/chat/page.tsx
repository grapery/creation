"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/providers/language-provider";
import { useAuthRequired } from "@/lib/hooks/use-auth-required";
import { chat, ChatSession } from "@/lib/api/chat";
import { ChatSessionItem } from "@/components/chat/chat-session-item";
import { Loader2, MessageSquarePlus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ChatListPage() {
    const { t } = useTranslation();
    const { isAuthenticated, isCheckingAuth, LoginPromptModal, requiresAuth } = useAuthRequired();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);

    // Show login prompt if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto flex items-center justify-center">
                {isCheckingAuth ? (
                    <div className="text-center space-y-4">
                        <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                        <p className="text-muted-foreground">Checking authentication...</p>
                    </div>
                ) : (
                    <div className="text-center space-y-4">
                        <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground" />
                        <div>
                            <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
                            <p className="text-muted-foreground max-w-md">
                                Please sign in to access your chat conversations and start chatting with characters.
                            </p>
                        </div>
                    </div>
                )}
                <LoginPromptModal
                    title="Start Chatting"
                    description="Sign in to view your chat history and continue conversations with characters."
                />
            </div>
        );
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const res = await chat.listSessions() as unknown;
                // Handle both array and object response formats
                if (Array.isArray(res)) {
                    setSessions(res);
                } else if (res && typeof res === 'object' && 'sessions' in res) {
                    setSessions((res as { sessions: ChatSession[] }).sessions || []);
                } else {
                    setSessions([]);
                }
            } catch (e) {
                console.error(e);
                setSessions([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <main className="flex-1 container max-w-6xl px-4 py-6 md:px-6 mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">{t("chat.title")}</h1>
                <Button size="icon" variant="ghost" asChild>
                    <Link href="/characters">
                        <MessageSquarePlus className="h-6 w-6" />
                    </Link>
                </Button>
            </div>

            <div className="bg-card md:border md:rounded-xl overflow-hidden min-h-[50vh]">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 p-8">
                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                            <MessageSquarePlus className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">{t("chat.no_messages")}</h3>
                        <p className="text-muted-foreground">{t("chat.start_chatting")}</p>
                        <Button asChild>
                            <Link href="/characters">{t("chat.explore_characters")}</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y">
                        {sessions.map(session => (
                            <ChatSessionItem key={session.id} session={session} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
