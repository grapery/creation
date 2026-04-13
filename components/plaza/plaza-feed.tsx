"use client";

import { useState, useEffect, useMemo } from "react";
import { plaza } from "@/lib/api/plaza";
import { PlazaSectionRail } from "./plaza-section-rail";
import { Loader2, Search, Sparkles } from "lucide-react";
import type { PlazaSection } from "@/lib/types";

export function PlazaFeed() {
    const [sections, setSections] = useState<PlazaSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadSections();
    }, []);

    const loadSections = async () => {
        try {
            const res = await plaza.getSections();
            setSections(res.sections || []);
        } catch (err) {
            console.error("Failed to load plaza:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredSections = useMemo(() => {
        if (!searchQuery.trim()) return sections;
        const q = searchQuery.toLowerCase();
        return sections.filter(s => {
            const title = (s.title || s.titleKey || "").toLowerCase();
            const subtitle = (s.subtitle || s.subtitleKey || "").toLowerCase();
            return title.includes(q) || subtitle.includes(q);
        });
    }, [sections, searchQuery]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sections..."
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary border-0 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
            </div>

            {/* Sections */}
            {filteredSections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Sparkles className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No content available</p>
                </div>
            ) : (
                filteredSections.map((section) => (
                    <PlazaSectionRail key={section.id} section={section} />
                ))
            )}
        </div>
    );
}
