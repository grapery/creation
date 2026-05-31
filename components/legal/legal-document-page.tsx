"use client";

import { useEffect, useState, type ComponentType } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { parseMarkdown, type MarkdownBlock } from "@/lib/legal/markdown";
import { parseInlineMarkdown } from "@/lib/legal/markdown-inline";

type LegalDocumentPageProps = {
    title: string;
    apiPath: string;
    fallbackMarkdown: string;
    fallbackLastUpdated: string;
    icon: ComponentType<{ className?: string }>;
};

export function LegalDocumentPage({
    title,
    apiPath,
    fallbackMarkdown,
    fallbackLastUpdated,
    icon: Icon,
}: LegalDocumentPageProps) {
    const [content, setContent] = useState<MarkdownBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadDocument() {
            setIsLoading(true);

            const applyFallback = () => {
                if (cancelled) return;
                setContent(parseMarkdown(fallbackMarkdown));
                setLastUpdated(fallbackLastUpdated);
            };

            try {
                const response = await fetch(apiPath);
                if (!response.ok) {
                    applyFallback();
                    return;
                }

                const data = (await response.json()) as {
                    content?: string;
                    lastUpdated?: string;
                };

                if (typeof data.content === "string" && data.content.trim()) {
                    if (cancelled) return;
                    setContent(parseMarkdown(data.content));
                    setLastUpdated(data.lastUpdated || fallbackLastUpdated);
                    return;
                }

                applyFallback();
            } catch {
                applyFallback();
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadDocument();

        return () => {
            cancelled = true;
        };
    }, [apiPath, fallbackMarkdown, fallbackLastUpdated]);

    return (
        <div className="container max-w-6xl px-4 py-6 mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Icon className="h-6 w-6 text-primary" />
                    {title}
                </h1>
                {lastUpdated && (
                    <p className="text-muted-foreground mt-1">最后更新：{lastUpdated}</p>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <Card className="border shadow-sm">
                    <CardContent className="space-y-6 p-6">
                        <div className="space-y-6">
                            {content.map((block, index) => (
                                <div key={index}>
                                    {block.type === "heading" && (
                                        <h2
                                            className={`font-bold ${
                                                block.level === 1
                                                    ? "text-3xl"
                                                    : block.level === 2
                                                      ? "text-2xl"
                                                      : "text-xl"
                                            }`}
                                        >
                                            {block.text}
                                        </h2>
                                    )}

                                    {block.type === "paragraph" && (
                                        <p className="text-base leading-relaxed text-foreground">
                                            {parseInlineMarkdown(block.text)}
                                        </p>
                                    )}

                                    {block.type === "bullet" && (
                                        <ul className="space-y-2 pl-6">
                                            {block.items.map((item, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <span className="font-semibold text-muted-foreground">
                                                        •
                                                    </span>
                                                    <span className="text-base leading-relaxed">
                                                        {parseInlineMarkdown(item)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {block.type === "ordered" && (
                                        <ol className="space-y-2 pl-6 list-decimal">
                                            {block.items.map((item, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <span className="font-semibold text-muted-foreground">
                                                        {i + 1}.
                                                    </span>
                                                    <span className="text-base leading-relaxed">
                                                        {parseInlineMarkdown(item)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ol>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
