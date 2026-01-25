"use client";

import { useState } from "react";
import { useTranslation } from "@/providers/language-provider";

interface StoryTabsProps {
    onTabChange: (tab: string) => void;
}

export function StoryTabs({ onTabChange }: StoryTabsProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("story");

    const tabs = [
        { id: "story", label: t("story_detail.tabs.story", "Story") },
        { id: "characters", label: t("story_detail.tabs.characters", "Characters") },
        { id: "scenes", label: t("story_detail.tabs.scenes", "Scenes") },
        { id: "team", label: t("story_detail.tabs.team", "Team") }
    ];

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        onTabChange(tabId);
    };

    return (
        <div className="flex items-center overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center space-x-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                            ? "text-primary font-bold bg-secondary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
