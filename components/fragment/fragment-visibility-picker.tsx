"use client";

import { Globe, Users, Lock } from "lucide-react";
import type { FragmentVisibility } from "@/lib/types";

interface FragmentVisibilityPickerProps {
    value: FragmentVisibility;
    onChange: (value: FragmentVisibility) => void;
}

const options: { value: FragmentVisibility; label: string; icon: typeof Globe; description: string }[] = [
    { value: "public", label: "Public", icon: Globe, description: "Everyone can see" },
    { value: "followers", label: "Followers", icon: Users, description: "Followers only" },
    { value: "private", label: "Private", icon: Lock, description: "Only you" },
];

export function FragmentVisibilityPicker({ value, onChange }: FragmentVisibilityPickerProps) {
    return (
        <div className="flex gap-2">
            {options.map((opt) => {
                const Icon = opt.icon;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`
                            flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border transition-all text-sm
                            ${value === opt.value
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border bg-background text-muted-foreground hover:border-primary/30"
                            }
                        `}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{opt.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
