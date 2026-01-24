"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    type?: 'text' | 'image' | 'video';
    mediaUrl?: string;
}

export default function CreationChatPage() {
    // Mock initial state
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: "Hi! I'm your creative assistant. Let's build a story together. What kind of story do you want to create today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const onSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        // Mock AI response
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "That sounds exciting! I've visualized a scene for you.",
                type: 'image',
                mediaUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60"
            };
            setMessages(prev => [...prev, aiMsg]);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container max-w-2xl px-4 py-8 mx-auto flex flex-col">
                <div className="flex-1 space-y-4 mb-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-primary" />
                                </div>
                            )}
                            <div className={`max-w-[80%] space-y-2`}>
                                <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p>{msg.content}</p>
                                </div>
                                {msg.type === 'image' && msg.mediaUrl && (
                                    <div className="rounded-lg overflow-hidden border">
                                        <img src={msg.mediaUrl} className="w-full h-auto" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div className="bg-muted p-3 rounded-lg flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Thinking...
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 sticky bottom-4">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your idea..."
                        onKeyDown={e => e.key === 'Enter' && onSend()}
                    />
                    <Button onClick={onSend} disabled={!input.trim() || loading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </main>
        </div>
    );
}
