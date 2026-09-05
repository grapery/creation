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

import { formatDistanceToNow } from "date-fns";
import { zhCN, ja, enUS } from "date-fns/locale";

/** 按界面语言格式化相对时间（date-fns 默认英文，这里跟随 i18n 语言码）。 */
export function formatRelativeTime(timestampSeconds: number, language: string): string {
    const locale = language === "zh-Hans" ? zhCN : language === "ja" ? ja : enUS;
    return formatDistanceToNow(new Date(timestampSeconds * 1000), { addSuffix: true, locale });
}

/** 毫秒时间戳/Date 的相对时间（支付记录、会话列表用毫秒）。 */
export function formatRelativeTimeMs(date: Date | number, language: string): string {
    const locale = language === "zh-Hans" ? zhCN : language === "ja" ? ja : enUS;
    return formatDistanceToNow(typeof date === "number" ? new Date(date) : date, { addSuffix: true, locale });
}
