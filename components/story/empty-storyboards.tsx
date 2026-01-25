"use client";

import { useTranslation } from "@/providers/language-provider";

interface EmptyStoryboardsProps {
    storyTitle: string;
}

export function EmptyStoryboards({ storyTitle }: EmptyStoryboardsProps) {
    const { t } = useTranslation();

    return (
        <div className="p-6 bg-background rounded-2xl border border-border/8">
            <div className="flex flex-col items-center gap-5 py-8">
                {/* Illustration */}
                <div className="w-[100px] h-[100px] rounded-full bg-muted flex items-center justify-center">
                    <svg
                        className="w-10 h-10 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18a8.967 8.967 0 003.75-.512V6.042c0-.735-.55-1.34-1.25-1.34H6.25c-.7 0-1.25.605-1.25 1.34z"
                        />
                    </svg>
                </div>

                {/* Message */}
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-foreground">
                        {t("story_detail.empty.no_storyboards_title", "No Storyboards Yet")}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-[280px]">
                        {t("story_detail.empty.no_storyboards_message", "{title} is waiting for its first storyboard. Start creating to bring the story to life.", { title: storyTitle })}
                    </p>
                </div>

                {/* Tips */}
                <div className="w-full bg-muted/50 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-semibold text-foreground">
                        {t("story_detail.empty.tips_title", "Tips for first storyboard")}
                    </h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span>{t("story_detail.empty.tip_opening", "Create an engaging opening scene")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{t("story_detail.empty.tip_characters", "Introduce key characters early")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <span>{t("story_detail.empty.tip_ai", "Use AI to generate content")}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
