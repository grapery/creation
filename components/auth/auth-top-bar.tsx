"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LanguageSelector } from "./language-selector";
import { Language } from "@/providers/language-provider";

interface AuthTopBarProps {
    showBack?: boolean;
    onBack?: () => void;
    currentLanguage?: Language;
    onLanguageChange?: (language: Language) => void;
}

export function AuthTopBar({
    showBack = false,
    onBack,
    currentLanguage = "en",
    onLanguageChange,
}: AuthTopBarProps) {
    return (
        <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Left: Back Button */}
                    <div className="w-10">
                        {showBack && onBack && (
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                        )}
                        {showBack && !onBack && (
                            <Link href="/login">
                                <button
                                    type="button"
                                    className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Right: Language Selector */}
                    {onLanguageChange && (
                        <LanguageSelector
                            currentLanguage={currentLanguage}
                            onLanguageChange={onLanguageChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
