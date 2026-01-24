"use client";

import { Layers } from "lucide-react";

export default function MyStoryboardsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Layers className="h-6 w-6" />
                <h2 className="text-xl font-bold">My Storyboards</h2>
            </div>
            <div className="border border-dashed rounded-lg p-10 text-center text-muted-foreground">
                No storyboards found.
            </div>
        </div>
    );
}
