import { useEffect, useState, useRef } from 'react';
import { apiClient } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

import { Plus, MessageSquare, Send } from 'lucide-react';
import type { ChatThread, ChatMessage, GenericResponse } from '../types';
import { formatDistanceToNow } from 'date-fns';

export default function AgentChat() {
    const [threads, setThreads] = useState<ChatThread[]>([]);
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch Threads
    useEffect(() => {
        const fetchThreads = async () => {
            try {
                // Using /agent/chat/threads
                const res = await apiClient.get<GenericResponse<{ threads: ChatThread[] }>>('/agent/chat/threads');
                const list = res.data.data.threads || [];
                setThreads(list);
                if (list.length > 0 && !activeThreadId) {
                    // Optional: Auto-select first thread or not
                    // setActiveThreadId(list[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch threads", error);
            }
        };
        fetchThreads();
    }, []);

    // Fetch Messages when thread changes
    useEffect(() => {
        if (!activeThreadId) return;
        const fetchMessages = async () => {
            try {
                // /agent/chat/threads/:id/messages
                const res = await apiClient.get<GenericResponse<{ messages: ChatMessage[] }>>(`/agent/chat/threads/${activeThreadId}/messages`);
                setMessages(res.data.data.messages || []);
                scrollToBottom();
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };
        fetchMessages();
    }, [activeThreadId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCreateThread = async () => {
        try {
            const res = await apiClient.post<GenericResponse<ChatThread>>('/agent/chat/threads', { title: 'New Chat' });
            const newThread = res.data.data;
            setThreads([newThread, ...threads]);
            setActiveThreadId(newThread.id);
            setMessages([]);
        } catch (error) {
            console.error("Failed to create thread", error);
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || !activeThreadId) return;

        const userMsg: ChatMessage = {
            id: 'temp-' + Date.now(),
            threadId: activeThreadId,
            role: 'user',
            content: input,
            createdAt: Date.now() / 1000
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        scrollToBottom();

        try {
            // /agent/chat/send
            // Payload usually requires threadId and content
            const res = await apiClient.post<GenericResponse<{ message: ChatMessage }>>('/agent/chat/send', {
                threadId: activeThreadId,
                content: userMsg.content
            });

            // The backend should return the AI response or the full message object
            // Assuming it returns the AI response message
            const aiMsg = res.data.data.message;
            if (aiMsg) {
                setMessages(prev => [...prev, aiMsg]);
            }
            scrollToBottom();
        } catch (error) {
            console.error("Failed to send message", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-48px)] bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <Button onClick={handleCreateThread} className="w-full gap-2">
                        <Plus className="w-4 h-4" /> New Chat
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {threads.map(thread => (
                        <div
                            key={thread.id}
                            onClick={() => setActiveThreadId(thread.id)}
                            className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${activeThreadId === thread.id ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''}`}
                        >
                            <p className="font-medium text-sm truncate text-gray-900">{thread.title || 'Untitled Chat'}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(thread.createdAt * 1000)} ago</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {activeThreadId ? (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-lg p-3 ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white border border-gray-200 shadow-sm rounded-bl-none'
                                        }`}>
                                        <p className={`text-sm ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}>{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-500 animate-pulse">
                                        Agent is typing...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 bg-white border-t border-gray-200">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1"
                                    disabled={loading}
                                />
                                <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
                        <MessageSquare className="w-12 h-12 opacity-20" />
                        <p>Select a chat or start a new one</p>
                    </div>
                )}
            </div>
        </div>
    );
}
