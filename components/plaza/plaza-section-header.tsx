"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/providers/language-provider";
import type { PlazaSection } from "@/lib/types";

interface PlazaSectionHeaderProps {
    section: PlazaSection;
    onSeeAll?: () => void;
}

/** 后端可能下发 i18n 键（snake_case，如 plaza_rail_trending_title），优先取已翻译文本。 */
function localizedOr(raw: string | undefined, key: string | undefined, t: (k: string, d?: string) => string): string {
    if (raw) return raw;
    if (key) return t(key.replace(/_/g, "."), key);
    return "";
}

export function PlazaSectionHeader({ section, onSeeAll }: PlazaSectionHeaderProps) {
    const { t } = useTranslation();
    const title = localizedOr(section.title, section.titleKey, t);
    const subtitle = localizedOr(section.subtitle, section.subtitleKey, t);
    const badge = localizedOr(section.badgeText, section.badgeKey, t);

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
                    {t("common.view_all", "View all")}
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
}
