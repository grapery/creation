import { useEffect, useState, useRef } from 'react';
import { apiClient } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import type { GenericResponse } from '../types';

interface StoryboardChatProps {
    storyboardId: string;
    context: string;
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt?: number;
}

interface ChatSession {
    session_id: string; // Updated to match backend response snake_case?
    // checking storyboard_chat.go: StartSessionRes { SessionID string `json:"session_id"` }
}

export function StoryboardChat({ storyboardId, context }: StoryboardChatProps) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initialize Session
    useEffect(() => {
        const initSession = async () => {
            setInitializing(true);
            try {
                // Post to /storyboard-chat/sessions (using proxy /api/storyboard-chat -> /agent/storyboard-chat in backend?)
                // Wait, handler.go: 
                // agentChatGroup.POST("/chat/send", h.AgentChatSend)
                // storyboardChatGroup := api.Group("/storyboard-chat") 
                // storyboardChatGroup.POST("/sessions", h.StartStoryboardChatSession)

                // My api.ts base is /api. So /storyboard-chat/sessions.

                const res = await apiClient.post<GenericResponse<ChatSession>>('/storyboard-chat/sessions', {
                    storyboard_id: storyboardId,
                    background: context
                });

                if (res.data.code === 0) {
                    setSessionId(res.data.data.session_id);
                    // Add initial greeting?
                    setMessages([{ role: 'assistant', content: 'What would you like to discuss about this scene?' }]);
                } else {
                    console.error("Failed to start session:", res.data.msg);
                }
            } catch (err) {
                console.error("Failed to init storyboard chat", err);
            } finally {
                setInitializing(false);
            }
        };

        if (storyboardId) {
            initSession();
        }
    }, [storyboardId, context]);

    // Format messages for display
    const scrollToBottom = () => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !sessionId) return;

        const userMsg: ChatMessage = { role: 'user', content: input, createdAt: Date.now() / 1000 };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // POST /storyboard-chat/messages
            const res = await apiClient.post<GenericResponse<{ content: string }>>('/storyboard-chat/messages', {
                session_id: sessionId,
                content: userMsg.content
            });

            if (res.data.code === 0) {
                // Determine if content is inside data directly or data.content
                // Looking at handler: c.JSON(http.StatusOK, response.Success(gin.H{"content": reply}))
                const reply = res.data.data.content;
                const botMsg: ChatMessage = { role: 'assistant', content: reply, createdAt: Date.now() / 1000 };
                setMessages(prev => [...prev, botMsg]);
            }
        } catch (err) {
            console.error("Failed to send message", err);
            setMessages(prev => [...prev, { role: 'system', content: 'Error sending message. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    if (initializing) {
        return <div className="flex h-full items-center justify-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Initializing...</div>;
    }

    if (!sessionId) {
        return <div className="p-4 text-center text-red-500">Failed to start chat session.</div>;
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden border">
            <div className="bg-white p-3 border-b flex items-center justify-between">
                <span className="font-semibold text-sm">Storyboard Assistant</span>
                <span className="text-xs text-green-500 flex items-center gap-1">● Active</span>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="w-8 h-8 mt-1">
                                <AvatarFallback className={msg.role === 'assistant' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200'}>
                                    {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                                </AvatarFallback>
                            </Avatar>
                            <div className={`rounded-lg p-3 text-sm max-w-[80%] ${msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : msg.role === 'system' ? 'bg-red-50 text-red-600 italic' : 'bg-white border shadow-sm text-gray-700'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-3">
                            <Avatar className="w-8 h-8 mt-1"><AvatarFallback className="bg-blue-100"><Bot className="w-4 h-4" /></AvatarFallback></Avatar>
                            <div className="bg-white border shadow-sm rounded-lg p-3 text-sm text-gray-400">
                                <div className="flex gap-1">
                                    <span className="animate-bounce">.</span>
                                    <span className="animate-bounce delay-75">.</span>
                                    <span className="animate-bounce delay-150">.</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-3 bg-white border-t flex gap-2">
                <Input
                    placeholder="Ask about this scene..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    disabled={loading}
                    className="flex-1"
                />
                <Button size="icon" onClick={handleSend} disabled={loading || !input.trim()}>
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
