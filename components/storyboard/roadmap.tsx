"use client";

import { Storyboard, StoryboardScene } from "@/lib/types";
import {
    TextCursor,
    FileText,
    List,
    Image as ImageIcon,
    Video,
    CheckCircle2,
    Circle,
    Clock
} from "lucide-react";
import { useTranslation } from "@/providers/language-provider";

interface RoadmapStep {
    id: number;
    title: string;
    icon: React.ReactNode;
    iconColor: string;
    status: "completed" | "inProgress" | "pending";
    content?: React.ReactNode;
    metadata?: string;
}

interface StoryboardRoadmapProps {
    storyboard: Storyboard;
}

export function StoryboardRoadmap({ storyboard }: StoryboardRoadmapProps) {
    const { t } = useTranslation();

    const steps: RoadmapStep[] = [
        {
            id: 1,
            title: t("storyboard_detail.step_raw_input"),
            icon: <TextCursor className="w-5 h-5" />,
            iconColor: "text-blue-500",
            status: "completed",
            content: (
                <div className="p-3 bg-muted rounded-[12px]">
                    <p className="text-sm text-foreground">
                        {storyboard.content || "No raw input available"}
                    </p>
                </div>
            ),
        },
        {
            id: 2,
            title: t("storyboard_detail.step_content_generation"),
            icon: <FileText className="w-5 h-5" />,
            iconColor: "text-purple-500",
            status: "completed",
            content: (
                <div className="p-3 bg-muted rounded-[12px]">
                    <p className="text-sm text-foreground">
                        {storyboard.content || "No content available"}
                    </p>
                </div>
            ),
        },
        {
            id: 3,
            title: t("storyboard_detail.step_scene_details"),
            icon: <List className="w-5 h-5" />,
            iconColor: "text-orange-500",
            status: "completed",
            content: storyboard.storyboardScenes ? (
                <div className="space-y-2">
                    {storyboard.storyboardScenes.map((scene, index) => (
                        <div
                            key={scene.id}
                            className="p-3 bg-muted rounded-[12px]"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-semibold text-foreground">
                                    {scene.title || `${t("storyboard_detail.scene")} ${scene.sequence || index + 1}`}
                                </h4>
                                <span className="text-[11px] text-muted-foreground px-2 py-1 bg-secondary rounded-full">
                                    {t("storyboard_detail.scene")} {scene.sequence || index + 1}
                                </span>
                            </div>
                            {scene.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {scene.description}
                                </p>
                            )}
                            {(scene.location || scene.timeOfDay || scene.mood) && (
                                <div className="flex gap-2 mt-2">
                                    {scene.location && (
                                        <span className="text-[11px] text-muted-foreground">
                                            📍 {scene.location}
                                        </span>
                                    )}
                                    {scene.timeOfDay && (
                                        <span className="text-[11px] text-muted-foreground">
                                            ⏰ {scene.timeOfDay}
                                        </span>
                                    )}
                                    {scene.mood && (
                                        <span className="text-[11px] text-muted-foreground">
                                            😊 {scene.mood}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : null,
        },
        {
            id: 4,
            title: t("storyboard_detail.step_images"),
            icon: <ImageIcon className="w-5 h-5" />,
            iconColor: "text-green-500",
            status: "completed",
            content: storyboard.storyboardScenes?.filter(s => s.image) ? (
                <div className="grid grid-cols-2 gap-2">
                    {storyboard.storyboardScenes
                        .filter(scene => scene.image)
                        .map((scene, index) => (
                            <div
                                key={scene.id}
                                className="relative rounded-[12px] overflow-hidden"
                            >
                                <img
                                    src={scene.image}
                                    alt={scene.title || `Scene ${index + 1}`}
                                    className="w-full h-[150px] object-cover"
                                />
                            </div>
                        ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No images generated yet</p>
            ),
        },
    ];

    // Add video step if videos exist
    if (storyboard.storyboardScenes?.some(s => s.videoUrl)) {
        steps.push({
            id: 5,
            title: t("storyboard_detail.step_videos"),
            icon: <Video className="w-5 h-5" />,
            iconColor: "text-red-500",
            status: "completed",
            content: storyboard.storyboardScenes?.filter(s => s.videoUrl) ? (
                <div className="space-y-2">
                    {storyboard.storyboardScenes
                        .filter(scene => scene.videoUrl)
                        .map((scene, index) => (
                            <div
                                key={scene.id}
                                className="p-3 bg-red-50/10 border border-red-500/20 rounded-[12px]"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="text-sm font-semibold text-foreground">
                                        {scene.title || `${t("storyboard_detail.scene")} ${index + 1}`}
                                    </h4>
                                    <div className="flex items-center gap-1 text-red-500">
                                        <Video className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                {scene.totalVideoDuration && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        <span>{scene.totalVideoDuration}s</span>
                                    </div>
                                )}
                                {scene.isSubdivided && (
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <List className="w-3 h-3 text-blue-500" />
                                        <span className="text-[11px] text-blue-500">
                                            {t("storyboard_detail.multi_segment_video")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            ) : null,
        });
    }

    const getStatusIcon = (status: RoadmapStep["status"]) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case "inProgress":
                return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
            case "pending":
                return <Circle className="w-4 h-4 text-muted-foreground" />;
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
                {t("storyboard_detail.generation_process")}
            </h2>

            <div className="p-4 bg-background border border-border rounded-[16px]">
                <div className="space-y-0">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex gap-4">
                            {/* Timeline Line and Icon */}
                            <div className="flex flex-col items-center">
                                <div className={`relative w-11 h-11 rounded-full ${step.iconColor}/20 flex items-center justify-center`}>
                                    <div className={`${step.iconColor}`}>
                                        {step.icon}
                                    </div>
                                    {/* Step Number Badge */}
                                    <div
                                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${step.iconColor} flex items-center justify-center`}
                                    >
                                        <span className="text-[10px] font-bold text-white">
                                            {step.id}
                                        </span>
                                    </div>
                                </div>
                                {/* Connecting Line */}
                                {index < steps.length - 1 && (
                                    <div className="w-0.5 h-4 bg-border" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-6">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-base font-semibold text-foreground">
                                        {step.title}
                                    </h3>
                                    {getStatusIcon(step.status)}
                                </div>
                                {step.metadata && (
                                    <p className="text-[11px] text-muted-foreground mt-1">
                                        {step.metadata}
                                    </p>
                                )}
                                {step.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
