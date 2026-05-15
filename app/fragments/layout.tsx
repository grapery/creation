"use client";

import { Header } from "@/components/layout/header";

export default function FragmentsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1">{children}</div>
        </div>
    );
}
