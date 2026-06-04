"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Heart, UserPlus, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/language-provider";
import { showSuccess } from "@/lib/toast-utils";

export default function NotificationSettingsPage() {
    const { t } = useTranslation();

    // Notification settings state
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(true);
    const [likeNotifs, setLikeNotifs] = useState(true);
    const [followNotifs, setFollowNotifs] = useState(true);
    const [commentNotifs, setCommentNotifs] = useState(true);
    const [mentionNotifs, setMentionNotifs] = useState(true);
    const [storyNotifs, setStoryNotifs] = useState(false);
    const [marketingEmails, setMarketingEmails] = useState(false);

    const handleSave = () => {
        // Save notification preferences
        showSuccess(t('notification_settings.saved'));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    {t('notification_settings.title')}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {t('notification_settings.subtitle')}
                </p>
            </div>

            {/* Notification Channels */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>
                        {t('notification_settings.channels')}
                    </CardTitle>
                    <CardDescription>
                        {t('notification_settings.channels_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    {t('notification_settings.email')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_settings.email_desc')}
                                </p>
                            </div>
                        </div>
                        <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    {t('notification_settings.push')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_settings.push_desc')}
                                </p>
                            </div>
                        </div>
                        <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
                    </div>
                </CardContent>
            </Card>

            {/* Activity Notifications */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>
                        {t('notification_settings.activity')}
                    </CardTitle>
                    <CardDescription>
                        {t('notification_settings.activity_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-100">
                                <Heart className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    {t('notification_settings.likes')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_settings.likes_desc')}
                                </p>
                            </div>
                        </div>
                        <Switch checked={likeNotifs} onCheckedChange={setLikeNotifs} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100">
                                <UserPlus className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    {t('notification_settings.follows')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_settings.follows_desc')}
                                </p>
                            </div>
                        </div>
                        <Switch checked={followNotifs} onCheckedChange={setFollowNotifs} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100">
                                <MessageSquare className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    {t('notification_settings.comments')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_settings.comments_desc')}
                                </p>
                            </div>
                        </div>
                        <Switch checked={commentNotifs} onCheckedChange={setCommentNotifs} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100">
                                <CheckCircle className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    {t('notification_settings.mentions')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_settings.mentions_desc')}
                                </p>
                            </div>
                        </div>
                        <Switch checked={mentionNotifs} onCheckedChange={setMentionNotifs} />
                    </div>
                </CardContent>
            </Card>

            {/* Content & Collaboration Notifications */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>
                        {t('notification_settings.content_collab')}
                    </CardTitle>
                    <CardDescription>
                        {t('notification_settings.content_collab_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-100">
                                <MessageSquare className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    {t('notification_settings.story_updates')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_settings.story_updates_desc')}
                                </p>
                            </div>
                        </div>
                        <Switch checked={storyNotifs} onCheckedChange={setStoryNotifs} />
                    </div>

                </CardContent>
            </Card>

            {/* Marketing Communications */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>
                        {t('notification_settings.marketing')}
                    </CardTitle>
                    <CardDescription>
                        {t('notification_settings.marketing_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-100">
                                <Mail className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    {t('notification_settings.marketing_email')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {t('notification_settings.marketing_email_desc')}
                                </p>
                            </div>
                        </div>
                        <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
                <Button variant="outline">
                    {t('notification_settings.cancel')}
                </Button>
                <Button onClick={handleSave}>
                    {t('notification_settings.save')}
                </Button>
            </div>
        </div>
    );
}
