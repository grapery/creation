"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/providers/language-provider";
import { useAuthRequired } from "@/lib/hooks/use-auth-required";
import { Header } from "@/components/layout/header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Heart, UserPlus, MessageCircle, Loader2, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { notifications as notificationsApi, Notification } from "@/lib/api/notifications";

export default function NotificationsPage() {
    const { t } = useTranslation();
    const { isAuthenticated, isCheckingAuth, LoginPromptModal } = useAuthRequired();
    const [activeTab, setActiveTab] = useState("all");
    const [items, setItems] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await notificationsApi.list(1, 50);
            setItems(res.notifications || []);
        } catch (e) {
            console.error("Failed to load notifications:", e);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchNotifications();
        notificationsApi.getUnreadCount().then(res => setUnreadCount(res.count)).catch(() => {});
    }, [isAuthenticated, fetchNotifications]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 container max-w-6xl px-4 py-8 mx-auto flex items-center justify-center">
                    {isCheckingAuth ? (
                        <div className="text-center space-y-4">
                            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                            <p className="text-muted-foreground">Loading...</p>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <Bell className="h-16 w-16 mx-auto text-muted-foreground" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">{t("notifications.title")}</h2>
                                <p className="text-muted-foreground max-w-md">
                                    {t("notifications.notifications_will_appear")}
                                </p>
                            </div>
                        </div>
                    )}
                </main>
                <LoginPromptModal />
            </div>
        );
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return <Heart className="h-4 w-4 text-red-500" fill="currentColor" />;
            case 'follow': return <UserPlus className="h-4 w-4 text-blue-500" />;
            case 'comment': return <MessageCircle className="h-4 w-4 text-green-500" />;
            default: return <Bell className="h-4 w-4 text-primary" />;
        }
    };

    const handleMarkRead = async (id: string) => {
        try {
            await notificationsApi.markAsRead(id);
            setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) { console.error(e); }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationsApi.markAllAsRead();
            setItems(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id: string) => {
        try {
            await notificationsApi.delete(id);
            setItems(prev => prev.filter(n => n.id !== id));
        } catch (e) { console.error(e); }
    };

    const filtered = activeTab === "all" ? items : items.filter(n => {
        if (activeTab === "likes") return n.type === "like";
        if (activeTab === "mentions") return n.type === "mention" || n.type === "comment";
        if (activeTab === "system") return n.type === "system" || n.type === "update";
        return true;
    });

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container max-w-6xl px-4 py-8 mx-auto">
                <div className="p-4 md:px-0">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">{t("notifications.title")}</h1>
                        {unreadCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                                <Check className="h-4 w-4 mr-1" />
                                {t("notifications.mark_all_read")}
                            </Button>
                        )}
                    </div>

                    <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide">
                            <TabsTrigger value="all">{t("notifications.tab_all")}</TabsTrigger>
                            <TabsTrigger value="likes">{t("notifications.tab_likes")}</TabsTrigger>
                            <TabsTrigger value="mentions">{t("notifications.tab_mentions")}</TabsTrigger>
                            <TabsTrigger value="system">{t("notifications.tab_system")}</TabsTrigger>
                        </TabsList>

                        <div className="mt-4 space-y-2">
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                    <p className="text-muted-foreground">{t("notifications.no_notifications_yet")}</p>
                                </div>
                            ) : (
                                filtered.map(note => (
                                    <div key={note.id} className={cn(
                                        "flex gap-4 p-4 rounded-lg bg-card/50 border hover:bg-card transition-colors group",
                                        !note.read && "bg-primary/5 border-primary/20"
                                    )}>
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarImage src={note.actorAvatar} />
                                                <AvatarFallback>{(note.actorName || "S")[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border">
                                                {getIcon(note.type)}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm">
                                                <span className="font-semibold">{note.actorName || t("notifications.title")}</span>{" "}
                                                {note.content || note.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {note.createdAt ? formatDistanceToNow(new Date(note.createdAt * 1000), { addSuffix: true }) : ""}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!note.read && (
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMarkRead(note.id)}>
                                                    <Check className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(note.id)}>
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
