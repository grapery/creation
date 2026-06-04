"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Loader2 } from "lucide-react";

export default function ProfileRedirectPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user?.id) {
            router.replace(`/profile/${user.id}`);
        } else {
            router.replace("/login");
        }
    }, [user, router]);

    return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}
