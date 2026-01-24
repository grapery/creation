"use client";

import { useTranslation } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";

export default function TestLanguagePage() {
    const { language, setLanguage, t } = useTranslation();

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold">Language Test Page</h1>

                {/* Current Language Display */}
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Current Language:</p>
                    <p className="text-2xl font-bold">{language}</p>
                </div>

                {/* Translation Test */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Translation Test</h2>
                    <div className="p-4 bg-card border rounded-lg space-y-2">
                        <p><strong>settings.title:</strong> {t("settings.title")}</p>
                        <p><strong>settings.language:</strong> {t("settings.language")}</p>
                        <p><strong>auth.sign_in:</strong> {t("auth.sign_in")}</p>
                        <p><strong>common.ok:</strong> {t("common.ok")}</p>
                        <p><strong>common.cancel:</strong> {t("common.cancel")}</p>
                    </div>
                </div>

                {/* Language Switcher */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Switch Language</h2>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant={language === "en" ? "default" : "outline"}
                            onClick={() => setLanguage("en")}
                        >
                            English
                        </Button>
                        <Button
                            variant={language === "zh-Hans" ? "default" : "outline"}
                            onClick={() => setLanguage("zh-Hans")}
                        >
                            简体中文
                        </Button>
                        <Button
                            variant={language === "ja" ? "default" : "outline"}
                            onClick={() => setLanguage("ja")}
                        >
                            日本語
                        </Button>
                    </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm">
                        If the translations above update immediately when you click the buttons,
                        the language switching is working correctly.
                    </p>
                </div>
            </div>
        </div>
    );
}
