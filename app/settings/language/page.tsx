"use client";

import { Header } from "@/components/layout/header";
import { LanguageSelector } from "@/components/auth/language-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/providers/language-provider";

export default function LanguageSettingsPage() {
    const { language, setLanguage, t } = useTranslation();

    const languages = [
        { code: "en" as const, name: "English", nativeName: "English" },
        { code: "zh-Hans" as const, name: "Simplified Chinese", nativeName: "简体中文" },
        { code: "ja" as const, name: "Japanese", nativeName: "日本語" },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container px-4 py-8 md:px-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Back Button */}
                    <Link
                        href="/settings"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t("common.back")}
                    </Link>

                    {/* Page Title */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{t("settings.language")}</h1>
                        <p className="text-muted-foreground">{t("settings.choose_preferred_language")}</p>
                    </div>

                    {/* Language Options Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                {t("settings.select_language")}
                            </CardTitle>
                            <CardDescription>
                                {t("settings.language_change_info")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        type="button"
                                        onClick={() => setLanguage(lang.code)}
                                        className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                                            language === lang.code
                                                ? "bg-accent text-accent-foreground"
                                                : "hover:bg-muted"
                                        }`}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium">{lang.nativeName}</span>
                                            <span className="text-sm text-muted-foreground">{lang.name}</span>
                                        </div>
                                        {language === lang.code && (
                                            <Check className="h-5 w-5 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Language Selector */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quick Access</CardTitle>
                            <CardDescription className="text-sm">
                                You can also change language from anywhere in the app using the selector in the header
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LanguageSelector />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
