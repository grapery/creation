"use client";

import { useTranslation } from "@/providers/language-provider";

/**
 * ICP filing link — content preserved as-is.
 */
export function LegalFooter({ className = "" }: { className?: string }) {
    const { t } = useTranslation();

    if (!t("footer.icp")) return null;

    return (
        <div className={`idea-legal-footer ${className}`}>
            <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
            >
                {t("footer.icp")}
            </a>
        </div>
    );
}
