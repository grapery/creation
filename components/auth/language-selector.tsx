"use client";

import React, { useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { Language, useTranslation, LANGUAGE_NAMES } from "@/providers/language-provider";

interface LanguageSelectorProps {
    className?: string;
    currentLanguage?: Language;
    onLanguageChange?: (language: Language) => void;
}

export function LanguageSelector({ className, currentLanguage, onLanguageChange }: LanguageSelectorProps) {
    const { language: contextLanguage, setLanguage: setContextLanguage } = useTranslation();
    const language = currentLanguage || contextLanguage;
    const [isOpen, setIsOpen] = useState(false);

    const languages = Object.entries(LANGUAGE_NAMES).map(([code, info]) => ({
        code: code as Language,
        ...info
    }));

    const currentLang = languages.find((lang) => lang.code === language) || languages[0];

    return (
        <div className={`relative ${className || ""}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
                <Globe className="h-4 w-4" />
                <span>{currentLang.nativeName}</span>
                <ChevronDown className="h-3 w-3" />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl bg-popover border shadow-lg">
                        <div className="py-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    type="button"
                                    onClick={() => {
                                        if (onLanguageChange) {
                                            onLanguageChange(lang.code);
                                        } else {
                                            setContextLanguage(lang.code);
                                        }
                                        setIsOpen(false);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                                >
                                    {language === lang.code && <Check className="h-4 w-4 text-primary" />}
                                    {language !== lang.code && <span className="h-4 w-4" />}
                                    <span>{lang.nativeName}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
