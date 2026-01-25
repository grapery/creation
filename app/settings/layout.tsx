"use client";

import { Header } from "@/components/layout/header";
import { SettingsSidebar } from "@/components/layout/settings-sidebar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1 container max-w-6xl px-4 py-8 md:px-6 mx-auto">
                <div className="flex flex-col md:grid md:grid-cols-[240px_1fr] gap-8">
                    <aside className="w-full md:sticky md:top-24 md:h-fit">
                        <div className="mb-4 px-2">
                            <h2 className="text-lg font-bold tracking-tight">Settings</h2>
                            <p className="text-sm text-muted-foreground">Manage your account preferences</p>
                        </div>
                        <SettingsSidebar />
                    </aside>
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
