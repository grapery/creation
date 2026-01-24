"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor, Check } from "lucide-react";

export default function AppearanceSettingsPage() {
    const router = useRouter();
    const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "system">("light");
    const [selectedFontSize, setSelectedFontSize] = useState<"small" | "medium" | "large">("medium");

    const themes = [
        { value: "light" as const, label: "Light", icon: Sun },
        { value: "dark" as const, label: "Dark", icon: Moon },
        { value: "system" as const, label: "System", icon: Monitor },
    ];

    const fontSizes = [
        { value: "small" as const, label: "Small" },
        { value: "medium" as const, label: "Medium" },
        { value: "large" as const, label: "Large" },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Back Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                            <span className="text-sm">←</span>
                        </button>
                        <h1 className="text-lg font-bold text-foreground">Appearance</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
                {/* Theme Section */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Theme</h2>
                        
                        <div className="space-y-2">
                            {themes.map((theme) => (
                                <button
                                    key={theme.value}
                                    onClick={() => setSelectedTheme(theme.value)}
                                    className={`
                                        w-full h-[40px] rounded-lg border-2 flex items-center justify-between px-4 transition-all
                                        ${selectedTheme === theme.value
                                            ? "bg-primary text-white border-primary"
                                            : "bg-transparent border-border hover:border-primary/50"
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <theme.icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{theme.label}</span>
                                    </div>
                                    {selectedTheme === theme.value && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Theme Preview Text */}
                        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                                Preview how the app looks with this theme
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Font Size Section */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Text Size</h2>
                        
                        <div className="space-y-2">
                            {fontSizes.map((size) => (
                                <button
                                    key={size.value}
                                    onClick={() => setSelectedFontSize(size.value)}
                                    className={`
                                        w-full h-[40px] rounded-lg border-2 flex items-center justify-between px-4 transition-all
                                        ${selectedFontSize === size.value
                                            ? "bg-primary text-white border-primary"
                                            : "bg-transparent border-border hover:border-primary/50"
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className={`
                                                w-4 h-4 rounded-sm text-xs font-semibold flex items-center justify-center
                                                ${size.value === "small" ? "h-3" : size.value === "medium" ? "h-4" : "h-5"}
                                                bg-muted-foreground text-background
                                            `}
                                        >
                                            A
                                        </div>
                                        <span className="text-sm font-medium">{size.label}</span>
                                    </div>
                                    {selectedFontSize === size.value && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Font Size Preview Text */}
                        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                            <p 
                                className={`
                                    text-muted-foreground
                                    ${selectedFontSize === "small" ? "text-xs" : selectedFontSize === "medium" ? "text-sm" : "text-base"}
                                `}
                            >
                                This is a sample text with the selected font size.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
