"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Heart, UserPlus, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/providers/language-provider";

export default function NotificationSettingsPage() {
    const { language } = useTranslation();

    // Notification settings state
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(true);
    const [likeNotifs, setLikeNotifs] = useState(true);
    const [followNotifs, setFollowNotifs] = useState(true);
    const [commentNotifs, setCommentNotifs] = useState(true);
    const [mentionNotifs, setMentionNotifs] = useState(true);
    const [storyNotifs, setStoryNotifs] = useState(false);
    const [groupNotifs, setGroupNotifs] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);

    const handleSave = () => {
        // Save notification preferences
        alert(language === 'zh-Hans' ? '通知设置已保存' : language === 'ja' ? '通知設定が保存されました' : 'Notification settings saved');
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-4xl px-4 py-8 mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                        <Bell className="h-8 w-8" />
                        {language === 'zh-Hans' ? '通知设置' : language === 'ja' ? '通知設定' : 'Notification Settings'}
                    </h1>
                    <p className="text-muted-foreground">
                        {language === 'zh-Hans'
                            ? '管理您希望接收的通知类型'
                            : language === 'ja'
                            ? '受け取る通知タイプを管理'
                            : 'Manage the types of notifications you want to receive'}
                    </p>
                </div>

                {/* Notification Channels */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>
                            {language === 'zh-Hans' ? '通知渠道' : language === 'ja' ? '通知チャンネル' : 'Notification Channels'}
                        </CardTitle>
                        <CardDescription>
                            {language === 'zh-Hans'
                                ? '选择接收通知的方式'
                                : language === 'ja'
                                ? '通知を受け取る方法を選択'
                                : 'Choose how you want to receive notifications'}
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
                                        {language === 'zh-Hans' ? '邮件通知' : language === 'ja' ? 'メール通知' : 'Email Notifications'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {language === 'zh-Hans'
                                            ? '通过邮件接收通知'
                                            : language === 'ja'
                                            ? 'メールで通知を受け取る'
                                            : 'Receive notifications via email'}
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
                                        {language === 'zh-Hans' ? '推送通知' : language === 'ja' ? 'プッシュ通知' : 'Push Notifications'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {language === 'zh-Hans'
                                            ? '在浏览器中接收推送通知'
                                            : language === 'ja'
                                            ? 'ブラウザでプッシュ通知を受け取る'
                                            : 'Receive push notifications in browser'}
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
                            {language === 'zh-Hans' ? '活动通知' : language === 'ja' ? 'アクティビティ通知' : 'Activity Notifications'}
                        </CardTitle>
                        <CardDescription>
                            {language === 'zh-Hans'
                                ? '当有人在您的内容上进行互动时通知您'
                                : language === 'ja'
                                ? 'コンテンツへのインタラクション時に通知'
                                : 'Get notified when others interact with your content'}
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
                                        {language === 'zh-Hans' ? '点赞通知' : language === 'ja' ? 'いいね通知' : 'Likes'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {language === 'zh-Hans'
                                            ? '当有人点赞您的故事或角色时'
                                            : language === 'ja'
                                            ? 'ストーリーやキャラクターがいいねされたとき'
                                            : 'When someone likes your stories or characters'}
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
                                        {language === 'zh-Hans' ? '关注通知' : language === 'ja' ? 'フォロー通知' : 'Follows'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {language === 'zh-Hans'
                                            ? '当有人关注您时'
                                            : language === 'ja'
                                            ? '誰かがあなたをフォローしたとき'
                                            : 'When someone follows you'}
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
                                        {language === 'zh-Hans' ? '评论通知' : language === 'ja' ? 'コメント通知' : 'Comments'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {language === 'zh-Hans'
                                            ? '当有人评论您的内容时'
                                            : language === 'ja'
                                            ? '誰かがあなたのコンテンツにコメントしたとき'
                                            : 'When someone comments on your content'}
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
                                        {language === 'zh-Hans' ? '提及通知' : language === 'ja' ? 'メンション通知' : 'Mentions'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {language === 'zh-Hans'
                                            ? '当有人在评论或故事中提及您时'
                                            : language === 'ja'
                                            ? '誰かがコメントやストーリーであなたをメンションしたとき'
                                            : 'When someone mentions you in comments or stories'}
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
                            {language === 'zh-Hans' ? '内容与协作通知' : language === 'ja' ? 'コンテンツとコラボレーション通知' : 'Content & Collaboration'}
                        </CardTitle>
                        <CardDescription>
                            {language === 'zh-Hans'
                                ? '关于故事和群组协作的通知'
                                : language === 'ja'
                                ? 'ストーリーとグループコラボレーションに関する通知'
                                : 'Notifications about stories and group collaboration'}
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
                                        {language === 'zh-Hans' ? '故事更新' : language === 'ja' ? 'ストーリー更新' : 'Story Updates'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {language === 'zh-Hans'
                                            ? '当您关注的故事有新分支时'
                                            : language === 'ja'
                                            ? 'フォローしているストーリーに新しいブランチが追加されたとき'
                                            : 'When followed stories get new branches'}
                                    </p>
                                </div>
                            </div>
                            <Switch checked={storyNotifs} onCheckedChange={setStoryNotifs} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-cyan-100">
                                    <UserPlus className="h-5 w-5 text-cyan-500" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {language === 'zh-Hans' ? '群组活动' : language === 'ja' ? 'グループアクティビティ' : 'Group Activity'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {language === 'zh-Hans'
                                            ? '群组邀请、成员变更等活动通知'
                                            : language === 'ja'
                                            ? 'グループ招待、メンバー変更などのアクティビティ通知'
                                            : 'Group invites, member changes, and activity'}
                                    </p>
                                </div>
                            </div>
                            <Switch checked={groupNotifs} onCheckedChange={setGroupNotifs} />
                        </div>
                    </CardContent>
                </Card>

                {/* Marketing Communications */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>
                            {language === 'zh-Hans' ? '营销通讯' : language === 'ja' ? 'マーケティング通信' : 'Marketing Communications'}
                        </CardTitle>
                        <CardDescription>
                            {language === 'zh-Hans'
                                ? '接收产品更新和促销信息'
                                : language === 'ja'
                                ? '製品アップデートやプロモーション情報を受け取る'
                                : 'Receive product updates and promotional information'}
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
                                        {language === 'zh-Hans' ? '营销邮件' : language === 'ja' ? 'マーケティングメール' : 'Marketing Emails'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {language === 'zh-Hans'
                                            ? '接收功能更新、优惠活动等邮件'
                                            : language === 'ja'
                                            ? '機能更新、キャンペーンなどのメールを受け取る'
                                            : 'Receive emails about features and offers'}
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
                        {language === 'zh-Hans' ? '取消' : language === 'ja' ? 'キャンセル' : 'Cancel'}
                    </Button>
                    <Button onClick={handleSave}>
                        {language === 'zh-Hans' ? '保存设置' : language === 'ja' ? '設定を保存' : 'Save Settings'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
