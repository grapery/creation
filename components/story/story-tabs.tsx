"use client";

import { useState } from "react";

interface StoryTabsProps {
    onTabChange: (tab: string) => void;
}

export function StoryTabs({ onTabChange }: StoryTabsProps) {
    const [activeTab, setActiveTab] = useState("story");

    const tabs = [
        { id: "story", label: "Story" },
        { id: "characters", label: "Characters" },
        { id: "scenes", label: "Scenes" },
        { id: "team", label: "Team" }
    ];

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        onTabChange(tabId);
    };

    return (
        <div className="flex items-center justify-center py-3">
            <div className="inline-flex items-center p-1 bg-muted rounded-full">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            activeTab === tab.id
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
