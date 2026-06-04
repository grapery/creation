"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, MessageSquare, CheckCircle } from "lucide-react";
import { feedback } from "@/lib/api/feedback";
import type { FeedbackCategory } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

const categories: { value: FeedbackCategory; label: string }[] = [
    { value: "bug", label: "Bug Report" },
    { value: "feature", label: "Feature Request" },
    { value: "improvement", label: "Improvement" },
    { value: "other", label: "Other" },
];

export default function FeedbackPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [category, setCategory] = useState<FeedbackCategory>("other");
    const [content, setContent] = useState("");
    const [contactInfo, setContactInfo] = useState("");

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await feedback.submit({ category, content, contactInfo: contactInfo || undefined });
            setSuccess(true);
            setContent("");
            setContactInfo("");
        } catch (err) {
            console.error("Feedback submission failed:", err);
        } finally {
            setLoading(false);
        }
    }, [category, content, contactInfo]);

    return (
        <div className="max-w-lg mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Send Feedback
                    </CardTitle>
                    <CardDescription>Help us improve your experience</CardDescription>
                </CardHeader>
                <CardContent>
                    {success && (
                        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            Thank you for your feedback!
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
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
                            <Label htmlFor="content">Your Feedback</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Tell us what you think..."
                                className="min-h-[120px]"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Info (optional)</Label>
                            <Input
                                id="contact"
                                value={contactInfo}
                                onChange={(e) => setContactInfo(e.target.value)}
                                placeholder="Email or other contact method"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading || !content.trim()}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Feedback
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
