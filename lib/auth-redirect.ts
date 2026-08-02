/** Safe post-login destination from ?next= or ?redirect= */
export function getSafeAuthNext(search?: string | null): string | null {
    const raw =
        typeof window !== "undefined"
            ? new URLSearchParams(search ?? window.location.search)
            : search
              ? new URLSearchParams(search)
              : null;
    if (!raw) return null;
    const next = raw.get("next") || raw.get("redirect");
    if (!next) return null;
    // Only same-origin relative paths
    if (!next.startsWith("/") || next.startsWith("//")) return null;
    if (next.startsWith("/login") || next.startsWith("/register")) return null;
    return next;
}

export function loginUrlWithNext(destination: string): string {
    const dest = destination.startsWith("/") && !destination.startsWith("//") ? destination : "/";
    return `/login?next=${encodeURIComponent(dest)}`;
}
