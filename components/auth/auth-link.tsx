"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { loginUrlWithNext } from "@/lib/auth-redirect";
import type { ComponentProps } from "react";

function hrefToPath(href: ComponentProps<typeof Link>["href"]): string {
    if (typeof href === "string") return href;
    if (href && typeof href === "object" && "pathname" in href && href.pathname) {
        const q = href.search || "";
        return `${href.pathname}${q}`;
    }
    return "/";
}

/**
 * Link that sends guests to full login with return URL (iOS FAB-style gate).
 * Safe to use with Button asChild.
 */
export function AuthLink({
    href,
    onClick,
    ...rest
}: ComponentProps<typeof Link>) {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <Link
            href={href}
            {...rest}
            onClick={(e) => {
                if (!user) {
                    e.preventDefault();
                    router.push(loginUrlWithNext(hrefToPath(href)));
                    return;
                }
                onClick?.(e);
            }}
        />
    );
}
