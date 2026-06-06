"use client";

import { useCallback, useState } from "react";
import { CheckCircle, Loader2, MessageSquare } from "lucide-react";

import { support } from "@/lib/api/support";
import type { FeedbackCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const categories: { value: FeedbackCategory; label: string }[] = [
    { value: "bug", label: "问题反馈" },
    { value: "feature", label: "功能建议" },
    { value: "improvement", label: "体验改进" },
    { value: "other", label: "其他" },
];

export function SupportFeedbackForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState<FeedbackCategory>("other");
    const [content, setContent] = useState("");
    const [contactInfo, setContactInfo] = useState("");

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await support.submitPublicFeedback({ category, content, contactInfo });
            setSuccess(true);
            setContent("");
            setContactInfo("");
        } catch (err) {
            console.error("Support feedback submission failed:", err);
            setError("提交失败，请稍后重试或直接发送邮件联系我们。");
        } finally {
            setLoading(false);
        }
    }, [category, content, contactInfo]);

    return (
        <Card className="border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    在线反馈
                </CardTitle>
                <CardDescription>
                    描述您遇到的问题或建议，提交后将保存至我们的系统，我们会尽快处理。
                </CardDescription>
            </CardHeader>
            <CardContent>
                {success && (
                    <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        感谢您的反馈，我们已保存您的消息，会尽快处理。
                    </div>
                )}
                {error && (
                    <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>反馈类型</Label>
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((cat) => (
                                <Button
                                    key={cat.value}
                                    size="sm"
                                    variant={category === cat.value ? "default" : "outline"}
                                    onClick={() => setCategory(cat.value)}
                                    type="button"
                                >
                                    {cat.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="support-content">问题或建议</Label>
                        <Textarea
                            id="support-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="请详细描述您遇到的问题、使用场景或改进建议..."
                            className="min-h-[140px]"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="support-contact">联系邮箱</Label>
                        <Input
                            id="support-contact"
                            type="email"
                            value={contactInfo}
                            onChange={(e) => setContactInfo(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !content.trim() || !contactInfo.trim()}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        提交反馈
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
