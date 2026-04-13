"use client";

import { FragmentStyle } from "@/lib/types";

interface FragmentStylePickerProps {
    styles: FragmentStyle[];
    selected?: string;
    onSelect: (style: FragmentStyle) => void;
    loading?: boolean;
}

export function FragmentStylePicker({ styles, selected, onSelect, loading }: FragmentStylePickerProps) {
    if (loading) {
        return (
            <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="shrink-0 w-16 h-10 rounded-full bg-muted animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {styles.map((style) => (
                <button
                    key={style.id}
                    onClick={() => onSelect(style)}
                    className={`
                        shrink-0 px-3 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border
                        ${selected === style.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:border-primary/40 hover:bg-muted"
                        }
                    `}
                >
                    {style.emoji && <span className="mr-1">{style.emoji}</span>}
                    {style.name}
                </button>
            ))}
        </div>
    );
}
