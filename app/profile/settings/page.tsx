"use client";

import { useRouter } from "next/navigation";
import { Settings, User, CreditCard, Bell, Globe, Shield, Lock, BarChart3, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/providers/language-provider";

const settingsItems = [
    { titleKey: "settings.profile_info", href: "/settings/profile", icon: User },
    { titleKey: "settings.membership_billing", href: "/settings/membership", icon: CreditCard },
    { titleKey: "settings.appearance", href: "/settings/appearance", icon: Settings },
    { titleKey: "settings.notifications", href: "/settings/notifications", icon: Bell },
    { titleKey: "settings.language", href: "/settings/language", icon: Globe },
    { titleKey: "settings.privacy_safety", href: "/settings/privacy", icon: Shield },
    { titleKey: "settings.legal", href: "/settings/security", icon: Lock },
    { titleKey: "settings.about", href: "/settings/usage", icon: BarChart3 },
    { titleKey: "Feedback", href: "/settings/feedback", icon: MessageSquare },
    { titleKey: "settings.about", href: "/settings/about", icon: HelpCircle },
];

export default function ProfileSettingsPage() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                <h2 className="text-xl font-bold">{t("settings.title")}</h2>
            </div>
            <Card>
                <CardContent className="p-2">
                    <div className="divide-y">
                        {settingsItems.map((item) => (
                            <Button
                                key={item.href}
                                variant="ghost"
                                className="w-full justify-start gap-3 h-12 px-4"
                                onClick={() => router.push(item.href)}
                            >
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                                <span>{t(item.titleKey)}</span>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
