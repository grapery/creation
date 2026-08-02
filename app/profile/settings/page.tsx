"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy path — settings live under /settings. */
export default function ProfileSettingsRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/settings");
    }, [router]);

    return null;
}
