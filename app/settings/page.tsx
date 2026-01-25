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
    titleKey: "profile",
    icon: User,
    color: "text-primary",
    items: [
        { label: "Profile Information", labelKey: "profile.edit_profile", href: "/settings/profile" },
        { label: "Membership & Billing", labelKey: "vip", href: "/settings/membership" },
    ],
};

const preferencesSettings: SettingsGroup = {
    title: "Preferences",
    titleKey: "",
    icon: Monitor,
    color: "text-purple-500",
    items: [
        { label: "Appearance", labelKey: "settings.appearance", href: "/settings/appearance" },
        { label: "Notifications", labelKey: "settings.notifications", href: "/notifications" },
        { label: "Language", labelKey: "settings.language", href: "/settings/language", description: "Choose your preferred language" },
        { label: "Privacy & Safety", labelKey: "settings.privacy", href: "/settings/privacy" },
    ],
};

const legalSettings: SettingsGroup = {
    title: "Legal",
    titleKey: "",
    icon: Shield,
    color: "text-green-500",
    items: [
        { label: "Terms of Service", labelKey: "auth.terms_of_service", href: "/settings/terms" },
        { label: "Privacy Policy", labelKey: "auth.privacy_policy", href: "/settings/privacy-policy" },
        { label: "About App", labelKey: "", href: "/settings/about" },
        { label: "Regulatory Information", labelKey: "", href: "/settings/regulatory" },
    ],
};

const accountActionsSettings: SettingsGroup = {
    title: "Account Actions",
    titleKey: "",
    icon: Shield,
    color: "text-destructive",
    items: [
        { label: "Delete Account", labelKey: "", href: "/settings/delete-account", description: "Permanently delete your account" },
        { label: "Sign Out", labelKey: "auth.sign_out", href: "/settings/signout", description: "Sign out of your account" },
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
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <SettingsGroupCard group={accountSettings} />
                    <SettingsGroupCard group={preferencesSettings} />
                </div>
                <div className="space-y-6">
                    <SettingsGroupCard group={legalSettings} />
                    <div className="md:hidden">
                        <SettingsGroupCard group={accountActionsSettings} isActionGroup />
                    </div>
                </div>
            </div>

            <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                    Voyager v1.0.0 (Web)
                </p>
            </div>
        </div>
    );
}
