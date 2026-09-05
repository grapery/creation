import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** 从 unknown 的 catch 值中安全取错误文案（APIError/Error 或任意带 message 的对象）。 */
export function errorMessage(e: unknown): string {
    if (e instanceof Error && e.message) return e.message;
    if (typeof e === "string" && e) return e;
    if (e && typeof e === "object" && "message" in e) {
        const msg = (e as { message?: unknown }).message;
        if (typeof msg === "string" && msg) return msg;
    }
    return "Unknown error";
}
