"use client";

import { Comment, comments } from "@/lib/api/comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Reply, Trash2, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

interface CommentItemProps {
    comment: Comment;
    onReply?: (comment: Comment) => void;
    onDelete?: (id: string) => void;
}

export function CommentItem({ comment, onReply, onDelete }: CommentItemProps) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [isLiked, setIsLiked] = useState(false); // Should come from API
    const [likes, setLikes] = useState(comment.likes || 0);

    const onLike = async () => {
        // Optimistic update
        if (isLiked) {
            setLikes(p => p - 1);
            setIsLiked(false);
            await comments.unlike(comment.id);
        } else {
            setLikes(p => p + 1);
            setIsLiked(true);
            await comments.like(comment.id);
        }
    };

    const isOwner = user?.id === comment.userId;

    return (
        <div className="flex gap-3 py-4 group">
            <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user?.avatar} />
                <AvatarFallback>{comment.user?.username?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="bg-muted/30 p-3 rounded-xl rounded-tl-sm">
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm">{comment.user?.displayName || comment.user?.username || t("comments.unknown")}</span>
                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt * 1000), { addSuffix: true })}</span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                </div>

                <div className="flex items-center gap-4 mt-1 pl-1">
                    <button
                        onClick={onLike}
                        className={cn("text-xs flex items-center gap-1 hover:text-red-500 transition-colors", isLiked ? "text-red-500" : "text-muted-foreground")}
                    >
                        <Heart className={cn("h-3 w-3", isLiked && "fill-current")} />
                        {likes > 0 && likes} {likes <= 1 ? t("comments.like") : t("comments.likes")}
                    </button>
                    <button
                        onClick={() => onReply?.(comment)}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                        <Reply className="h-3 w-3" /> {t("comments.reply")}
                    </button>
                    {isOwner && onDelete && (
                        <button
                            onClick={() => onDelete(comment.id)}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="h-3 w-3" /> {t("common.delete")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
