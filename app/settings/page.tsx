"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, User, Shield, Bell, Globe, Lock, Mail, Trash2, LogOut, Monitor, Info } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/providers/language-provider";

type SettingsGroup = {
    title: string;
    titleKey: string;
    icon: React.ElementType;
    color: string;
    items: {
        label: string;
        labelKey: string;
        href: string;
        description?: string;
        descriptionKey?: string;
    }[];
};

const accountSettings: SettingsGroup = {
    title: "Account",
    titleKey: "settings.account",
    icon: User,
    color: "text-primary",
    items: [
        { label: "Profile Information", labelKey: "settings.profile_info", href: "/settings/profile" },
        { label: "Membership & Billing", labelKey: "settings.membership_billing", href: "/settings/membership" },
        { label: "Payment History", labelKey: "Payment History", href: "/payment-history" },
    ],
};

const preferencesSettings: SettingsGroup = {
    title: "Preferences",
    titleKey: "settings.preferences",
    icon: Monitor,
    color: "text-purple-500",
    items: [
        { label: "Appearance", labelKey: "settings.appearance", href: "/settings/appearance" },
        { label: "Notifications", labelKey: "settings.notifications", href: "/settings/notifications", description: "Choose your notification preferences", descriptionKey: "settings.notifications_desc" },
        { label: "Language", labelKey: "settings.language", href: "/settings/language", description: "Choose your preferred language", descriptionKey: "settings.language_desc" },
        { label: "Privacy & Safety", labelKey: "settings.privacy_safety", href: "/settings/privacy" },
    ],
};

const legalSettings: SettingsGroup = {
    title: "Legal",
    titleKey: "settings.legal",
    icon: Shield,
    color: "text-green-500",
    items: [
        { label: "Terms of Service", labelKey: "settings.terms_of_service", href: "/settings/terms" },
        { label: "Privacy Policy", labelKey: "settings.privacy_policy", href: "/settings/privacy" },
        { label: "About App", labelKey: "settings.about", href: "/settings/about" },
    ],
};

function SettingsGroupCard({ group, isActionGroup = false }: { group: SettingsGroup; isActionGroup?: boolean }) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                    <div className="p-2 bg-secondary rounded-md">
                        <group.icon className="w-4 h-4" />
                    </div>
                    {group.titleKey ? t(group.titleKey as any) : group.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="space-y-0">
                    {group.items.map((item, index) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`
                                flex items-center justify-between p-4 hover:bg-muted/50 transition-colors
                                ${index !== group.items.length - 1 ? 'border-b border-border' : ''}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-foreground">
                                        {item.labelKey ? t(item.labelKey as any) : item.label}
                                    </div>
                                    {item.description && (
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            {item.descriptionKey ? t(item.descriptionKey as any) : item.description}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {!isActionGroup && (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function SettingsPage() {
    const { t, language } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <SettingsGroupCard group={accountSettings} />
                    <SettingsGroupCard group={preferencesSettings} />
                </div>
                <div className="space-y-6">
                    <SettingsGroupCard group={legalSettings} />
                </div>
            </div>

            <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                    {language === 'zh-Hans' ? '未择 Voyager v1.0.0 (网页版)' :
                     language === 'ja' ? 'Voyager v1.0.0 (Web)' :
                     'Voyager v1.0.0 (Web)'}
                </p>
            </div>
        </div>
    );
}
