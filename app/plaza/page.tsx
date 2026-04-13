"use client";

import { Header } from "@/components/layout/header";
import { PlazaFeed } from "@/components/plaza/plaza-feed";
import { useTranslation } from "@/providers/language-provider";

export default function PlazaPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container max-w-6xl mx-auto px-4 py-6 space-y-6">
                {/* Feed */}
                <PlazaFeed />
            </main>
        </div>
    );
}
