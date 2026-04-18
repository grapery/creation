"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SearchBarProps {
    className?: string;
    placeholder?: string;
}

export function SearchBar({ className, placeholder = "Search stories, characters..." }: SearchBarProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = useCallback(() => {
        if (!query.trim()) return;
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setFocused(false);
    }, [query, router]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
        if (e.key === "Escape") {
            setFocused(false);
            inputRef.current?.blur();
        }
    }, [handleSearch]);

    return (
        <div className={`relative ${className || ""}`}>
            <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onKeyDown={handleKeyDown}
                    className="pl-9 pr-8"
                />
                {query && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 h-6 w-6"
                        onClick={() => setQuery("")}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
                {loading && <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
        </div>
    );
}
