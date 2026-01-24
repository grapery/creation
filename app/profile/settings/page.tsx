"use client";

import { Settings } from "lucide-react";

export default function ProfileSettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                <h2 className="text-xl font-bold">Settings</h2>
            </div>
            <div className="border border-dashed rounded-lg p-10 text-center text-muted-foreground">
                Settings page placeholder.
            </div>
        </div>
    );
}
