"use client";

import { useState, useCallback } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookmarks } from "@/lib/api/interactions";
import type { BookmarkType } from "@/lib/types";

interface BookmarkButtonProps {
    type: BookmarkType;
    id: string;
    initialBookmarked?: boolean;
    size?: "sm" | "default" | "lg" | "icon";
    variant?: "ghost" | "outline" | "default";
    className?: string;
    onToggle?: (bookmarked: boolean) => void;
}

export function BookmarkButton({
    type,
    id,
    initialBookmarked = false,
    size = "icon",
    variant = "ghost",
    className,
    onToggle,
}: BookmarkButtonProps) {
    const [bookmarked, setBookmarked] = useState(initialBookmarked);
    const [loading, setLoading] = useState(false);

    const handleToggle = useCallback(async () => {
        setLoading(true);
        const previous = bookmarked;
        setBookmarked(!previous);
        try {
            const result = await bookmarks.toggleBookmark(type, id);
            setBookmarked(result.isBookmarked);
            onToggle?.(result.isBookmarked);
        } catch {
            setBookmarked(previous);
        } finally {
            setLoading(false);
        }
    }, [type, id, bookmarked, onToggle]);

    return (
        <Button
            size={size}
            variant={variant}
            className={className}
            onClick={handleToggle}
            disabled={loading}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
        >
            {bookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
                <Bookmark className="h-4 w-4" />
            )}
        </Button>
    );
}
