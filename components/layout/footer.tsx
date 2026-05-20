"use client";

import Link from "next/link";
import { useTranslation } from "@/providers/language-provider";

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="border-t bg-background">
            <div className="container max-w-6xl px-4 py-4 mx-auto">
                <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                        <Link href="/privacy" className="hover:text-foreground">{t("footer.privacy")}</Link>
                        <Link href="/terms" className="hover:text-foreground">{t("footer.terms")}</Link>
                    </div>
                    <div>{t("footer.copyright")}</div>
                    {t("footer.icp") && (
                        <div>
                            <a
                                href="https://beian.miit.gov.cn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-foreground"
                            >
                                {t("footer.icp")}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}
