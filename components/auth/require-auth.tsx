"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { loginUrlWithNext } from "@/lib/auth-redirect";

/**
 * Hard auth gate aligned with iOS Voyager FAB/tab behavior:
 * guests are sent to full login (not a dismissible sheet over create UI).
 */
export function RequireAuth({
    children,
}: {
    children: React.ReactNode;
    /** Unused visually — kept for call-site clarity */
    title?: string;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;
        if (user) return;
        const qs = typeof window !== "undefined" ? window.location.search : "";
        const next = `${pathname || "/"}${qs}`;
        router.replace(loginUrlWithNext(next));
    }, [user, loading, router, pathname]);

    if (loading || !user) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading" />
            </div>
        );
    }

    return <>{children}</>;
}
