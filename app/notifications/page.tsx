"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Heart, UserPlus, MessageCircle } from "lucide-react";
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
    const [activeTab, setActiveTab] = useState("all");

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
            <main className="flex-1 container max-w-2xl px-0 md:px-4 py-0 md:py-8 mx-auto">
                <div className="p-4 md:px-0">
                    <h1 className="text-2xl font-bold mb-4">Notifications</h1>

                    <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="likes">Likes</TabsTrigger>
                            <TabsTrigger value="mentions">Mentions</TabsTrigger>
                            <TabsTrigger value="system">System</TabsTrigger>
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
