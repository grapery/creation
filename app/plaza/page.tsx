"use client";

import { PlazaFeed } from "@/components/plaza/plaza-feed";
import { Compass } from "lucide-react";

export default function PlazaPage() {
    return (
        <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Compass className="w-6 h-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Plaza</h1>
                    <p className="text-muted-foreground text-sm">Discover trending stories and fragments</p>
                </div>
            </div>

            {/* Feed */}
            <PlazaFeed />
        </div>
    );
}
