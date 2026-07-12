"use client";

import Link from "next/link";
import { useTranslation } from "@/providers/language-provider";
import { LegalFooter } from "@/components/marketing/legal-footer";

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="border-t border-[var(--idea-border)] bg-white">
            <div className="container max-w-6xl px-4 py-6 mx-auto">
                <div className="flex flex-col items-center gap-3">
                    <div className="idea-floating-bar flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[var(--idea-text-muted)]">
                        <Link href="/about" className="idea-link">{t("footer.about")}</Link>
                        <span className="w-px h-3 bg-[var(--idea-border)]" />
                        <Link href="/support" className="idea-link">{t("footer.support")}</Link>
                        <span className="w-px h-3 bg-[var(--idea-border)]" />
                        <Link href="/privacy" className="idea-link">{t("footer.privacy")}</Link>
                        <span className="w-px h-3 bg-[var(--idea-border)]" />
                        <Link href="/terms" className="idea-link">{t("footer.terms")}</Link>
                    </div>
                    <div className="text-xs text-[var(--idea-text-muted)]">{t("footer.copyright")}</div>
                    <LegalFooter />
                </div>
            </div>
        </footer>
    );
}
