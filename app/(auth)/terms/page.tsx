"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Clock, FileText } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type MarkdownBlock =
    | { type: "heading"; level: number; text: string }
    | { type: "paragraph"; text: string }
    | { type: "bullet"; items: string[] }
    | { type: "ordered"; items: string[] };

export default function TermsOfServicePage() {
    const [content, setContent] = useState<MarkdownBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState<string>("");

    useEffect(() => {
        async function loadTerms() {
            setIsLoading(true);
            setError("");

            try {
                // Try to fetch from API first
                const response = await fetch("/api/legal/terms");
                if (response.ok) {
                    const data = await response.json();
                    if (data.content) {
                        setContent(parseMarkdown(data.content));
                        setLastUpdated(data.lastUpdated || "");
                    }
                } else {
                    // Fallback to static content
                    loadStaticContent();
                }
            } catch (e) {
                // Fallback to static content
                loadStaticContent();
            } finally {
                setIsLoading(false);
            }
        }

        loadTerms();
    }, []);

    function loadStaticContent() {
        const staticContent = `# Terms of Service

## 1. Acceptance of Terms

By accessing or using the Voyager service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.

## 2. Changes to Terms

We reserve the right to modify these terms at any time. Your continued use of the service after any changes constitutes your acceptance of the new terms.

## 3. Account Responsibilities

You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password.

You must:
- Provide accurate, current, and complete information
- Maintain and update your account information
- Accept responsibility for all activities under your account

## 4. Privacy Policy

Your privacy is important to us. Please review our Privacy Policy, which also governs the use of our service, to understand our practices.

## 5. Intellectual Property

The content, features, and functionality of the Voyager service are owned by us and are protected by copyright, trademark, and other intellectual property laws.

You agree not to:
- Copy, modify, or distribute our content without permission
- Reverse engineer or attempt to extract source code
- Remove any proprietary notices

## 6. User Content

You retain ownership of any content you create, submit, post, or display on the service.

By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content.

## 7. Prohibited Activities

You agree not to use the service to:
- Post or transmit harmful, illegal, or offensive content
- Harass, abuse, or harm others
- Impersonate any person or entity
- Violate any applicable laws or regulations

## 8. Termination

We reserve the right to suspend or terminate your account at any time for any reason, including violation of these terms.

## 9. Limitation of Liability

We are not liable for any indirect, incidental, special, or consequential damages resulting from your use of the service.

## 10. Contact Us

If you have questions about these terms, please contact us at support@voyager.com.

Last Updated: January 2026`;

        setContent(parseMarkdown(staticContent));
        setLastUpdated("January 2026");
    }

    function parseMarkdown(markdown: string): MarkdownBlock[] {
        const blocks: MarkdownBlock[] = [];
        const lines = markdown.split("\n");
        let currentParagraph: string[] = [];
        let currentBullets: string[] = [];
        let currentOrdered: string[] = [];

        const flushParagraph = () => {
            if (currentParagraph.length > 0) {
                blocks.push({ type: "paragraph", text: currentParagraph.join("\n").trim() });
                currentParagraph = [];
            }
        };

        const flushBullets = () => {
            if (currentBullets.length > 0) {
                blocks.push({ type: "bullet", items: [...currentBullets] });
                currentBullets = [];
            }
        };

        const flushOrdered = () => {
            if (currentOrdered.length > 0) {
                blocks.push({ type: "ordered", items: [...currentOrdered] });
                currentOrdered = [];
            }
        };

        for (let line of lines) {
            const trimmed = line.trim();

            if (trimmed === "") {
                flushParagraph();
                flushBullets();
                flushOrdered();
                continue;
            }

            const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                flushParagraph();
                flushBullets();
                flushOrdered();
                const level = headingMatch[1].length;
                const text = headingMatch[2].trim();
                blocks.push({ type: "heading", level, text });
                continue;
            }

            if (trimmed.startsWith("- ")) {
                flushParagraph();
                flushOrdered();
                currentBullets.push(trimmed.slice(2).trim());
                continue;
            }

            const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
            if (orderedMatch) {
                flushParagraph();
                flushBullets();
                currentOrdered.push(orderedMatch[2].trim());
                continue;
            }

            currentParagraph.push(trimmed);
        }

        flushParagraph();
        flushBullets();
        flushOrdered();

        return blocks;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Top Bar */}
            <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </Link>

                        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                            Done
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-20 text-destructive">
                        {error}
                    </div>
                ) : (
                    <Card className="border-0 shadow-none bg-transparent">
                        <CardContent className="space-y-6">
                            {/* Last Updated */}
                            {lastUpdated && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/50">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Last Updated: {lastUpdated}
                                    </span>
                                </div>
                            )}

                            {/* Document Content */}
                            <div className="space-y-6">
                                {content.map((block, index) => (
                                    <div key={index}>
                                        {block.type === "heading" && (
                                            <h2 className={`font-bold ${
                                                block.level === 1 ? "text-3xl" :
                                                block.level === 2 ? "text-2xl" :
                                                "text-xl"
                                            }`}>
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
                                                        <span className="font-semibold text-muted-foreground">•</span>
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
                                                        <span className="font-semibold text-muted-foreground">{i + 1}.</span>
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
        </div>
    );
}

function parseInlineMarkdown(text: string): JSX.Element {
    // Simple inline markdown parsing for bold and links
    let result = text;

    // Bold: **text**
    result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Links: [text](url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
}
