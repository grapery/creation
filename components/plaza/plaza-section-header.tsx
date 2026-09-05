"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import type { PlazaSection } from "@/lib/types";

interface PlazaSectionHeaderProps {
    section: PlazaSection;
    onSeeAll?: () => void;
}

export function PlazaSectionHeader({ section, onSeeAll }: PlazaSectionHeaderProps) {
    const title = section.title || section.titleKey || "";
    const subtitle = section.subtitle || section.subtitleKey || "";
    const badge = section.badgeText || section.badgeKey || "";

    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 min-w-0">
                {/* Avatar */}
                {section.avatarURL && (
                    <Image src={section.avatarURL} alt="" width={28} height={28} className="rounded-full shrink-0" sizes="28px" />
                )}
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">{title}</h3>
                        {badge && (
                            <span className="shrink-0 px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-medium">
                                {badge}
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                    )}
                </div>
            </div>
            {onSeeAll && (
                <button
                    onClick={onSeeAll}
                    className="shrink-0 flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"
                >
                    See all
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
}
