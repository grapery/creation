"use client";

import { useState, useEffect } from "react";
import { comments, Comment } from "@/lib/api/comments";
import { CommentItem } from "./comment-item";
import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea" // Removed
import { Loader2, Send } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { Label } from "@/components/ui/label"; // Ensure imports are correct

// Inline Textarea because ui/textarea might not exist or had issues?
// I removed Textarea import before. Let's check or define inline.
// I'll define inline again just to be safe and avoid build errors loop.
function SimpleTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
}

interface CommentListProps {
    targetId: string;
    targetType: 'story' | 'storyboard';
}

export function CommentList({ targetId, targetType }: CommentListProps) {
    const { user } = useAuth();
    const [items, setItems] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [content, setContent] = useState("");
    const [replyTo, setReplyTo] = useState<Comment | null>(null);

    useEffect(() => {
        loadComments();
    }, [targetId]);

    const loadComments = async () => {
        try {
            const res = await comments.list(targetId);
            setItems(res.comments || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async () => {
        if (!content.trim()) return;
        setSubmitting(true);
        try {
            const newComment = await comments.create({
                targetId,
                targetType,
                content,
                parentId: replyTo?.id
            });
            // Add to list (at top or bottom depending on pref)
            setItems(prev => [newComment, ...prev]);
            setContent("");
            setReplyTo(null);
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    const onDelete = async (id: string) => {
        if (!confirm("Delete this comment?")) return;
        try {
            await comments.delete(id);
            setItems(prev => prev.filter(c => c.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Comments ({items.length})</h3>

            {/* Input */}
            {user ? (
                <div className="bg-card p-4 rounded-xl border space-y-3">
                    {replyTo && (
                        <div className="text-sm text-muted-foreground flex justify-between items-center bg-muted/50 p-2 rounded">
                            <span>Replying to <b>{replyTo.user?.username}</b></span>
                            <button onClick={() => setReplyTo(null)} className="text-xs hover:underline">Cancel</button>
                        </div>
                    )}
                    <SimpleTextarea
                        placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="bg-transparent resize-none border-0 focus-visible:ring-0 p-0 text-base"
                        rows={2}
                    />
                    <div className="flex justify-end">
                        <Button size="sm" onClick={onSubmit} disabled={!content.trim() || submitting}>
                            {submitting && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                            Post
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="bg-muted/50 p-6 rounded-xl text-center">
                    <p className="text-muted-foreground mb-4">Log in to join the conversation.</p>
                    <Button variant="outline" asChild>
                        <Link href="/login">Log In</Link>
                    </Button>
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : items.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No comments yet.
                </div>
            ) : (
                <div className="divide-y divide-border/50">
                    {items.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={setReplyTo}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
