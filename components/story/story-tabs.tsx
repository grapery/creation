import { useState } from "react";
import { useTranslation } from "@/providers/language-provider";
import { BookOpen, Users, Clapperboard, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryTabsProps {
    onTabChange: (tab: string) => void;
}

export function StoryTabs({ onTabChange }: StoryTabsProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("story");

    const tabs = [
        { id: "story", label: t("story_detail.tabs.story", "Story"), icon: BookOpen },
        { id: "characters", label: t("story_detail.tabs.characters", "Characters"), icon: Users },
        { id: "scenes", label: t("story_detail.tabs.scenes", "Scenes"), icon: Clapperboard },
        { id: "team", label: t("story_detail.tabs.team", "Team"), icon: PenTool }
    ];

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        onTabChange(tabId);
    };

    return (
        <div className="flex items-center overflow-x-auto pb-0 scrollbar-hide border-b bg-background w-full">
            <div className="flex items-center w-full">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                isActive
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
