"use client";

import { useState } from "react";
import { useTranslation } from "@/providers/language-provider";
import { useAuthRequired } from "@/lib/hooks/use-auth-required";
import { Header } from "@/components/layout/header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Heart, UserPlus, MessageCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// Mock Notification Data
const mockNotifications = [
    { id: '1', type: 'like', user: 'Alice', userAvatar: '', message: 'liked your story', target: 'The Lost World', time: Date.now() - 1000 * 60 * 5 },
    { id: '2', type: 'follow', user: 'Bob', userAvatar: '', message: 'started following you', target: '', time: Date.now() - 1000 * 60 * 60 },
    { id: '3', type: 'comment', user: 'Charlie', userAvatar: '', message: 'commented on', target: 'Chapter 1', time: Date.now() - 1000 * 60 * 60 * 24 },
    { id: '4', type: 'system', user: 'System', userAvatar: '', message: 'Welcome to Voyager!', target: '', time: Date.now() - 1000 * 60 * 60 * 48 },
];

export default function NotificationsPage() {
    const { t } = useTranslation();
    const { isAuthenticated, isCheckingAuth, LoginPromptModal } = useAuthRequired();
    const [activeTab, setActiveTab] = useState("all");

    // Show login prompt if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 container max-w-6xl px-4 py-8 mx-auto flex items-center justify-center">
                    {isCheckingAuth ? (
                        <div className="text-center space-y-4">
                            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                            <p className="text-muted-foreground">Checking authentication...</p>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <Bell className="h-16 w-16 mx-auto text-muted-foreground" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
                                <p className="text-muted-foreground max-w-md">
                                    Please sign in to view your notifications and stay updated with your account activity.
                                </p>
                            </div>
                        </div>
                    )}
                </main>
                <LoginPromptModal
                    title="View Your Notifications"
                    description="Sign in to see your likes, follows, comments, and system updates."
                />
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

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container max-w-6xl px-4 py-8 mx-auto">
                <div className="p-4 md:px-0">
                    <h1 className="text-2xl font-bold mb-4">{t("notifications.title")}</h1>

                    <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide">
                            <TabsTrigger value="all">{t("notifications.tab_all")}</TabsTrigger>
                            <TabsTrigger value="likes">{t("notifications.tab_likes")}</TabsTrigger>
                            <TabsTrigger value="mentions">{t("notifications.tab_mentions")}</TabsTrigger>
                            <TabsTrigger value="system">{t("notifications.tab_system")}</TabsTrigger>
                        </TabsList>

                        <div className="mt-4 space-y-2">
                            {mockNotifications.map(note => (
                                <div key={note.id} className="flex gap-4 p-4 rounded-lg bg-card/50 border hover:bg-card transition-colors">
                                    <div className="relative">
                                        <Avatar>
                                            <AvatarImage src={note.userAvatar} />
                                            <AvatarFallback>{note.user[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border">
                                            {getIcon(note.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm">
                                            <span className="font-semibold">{note.user}</span> {note.message} <span className="font-medium text-foreground">{note.target}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(new Date(note.time), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Empty state if filtering logic added */}
                        </div>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
