"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Clock, Shield } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type MarkdownBlock =
    | { type: "heading"; level: number; text: string }
    | { type: "paragraph"; text: string }
    | { type: "bullet"; items: string[] }
    | { type: "ordered"; items: string[] };

export default function PrivacyPolicyPage() {
    const [content, setContent] = useState<MarkdownBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState<string>("");

    useEffect(() => {
        async function loadPrivacy() {
            setIsLoading(true);
            setError("");

            try {
                // Try to fetch from API first
                const response = await fetch("/api/legal/privacy");
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

        loadPrivacy();
    }, []);

    function loadStaticContent() {
        const staticContent = `# Privacy Policy

## 1. Information We Collect

We collect information you provide directly to us, including:

- Account information: name, email, username, password
- Profile information: avatar, bio, preferences
- Content you create: stories, storyboards, characters
- Communications: messages, support inquiries

## 2. Information Automatically Collected

We automatically collect information when you use our service:

- Device information: IP address, browser type, device type
- Usage data: pages visited, features used, time spent
- Cookies and similar technologies to enhance your experience

## 3. How We Use Your Information

We use the information we collect to:

- Provide, maintain, and improve our services
- Process transactions and send related information
- Send technical notices and support messages
- Respond to comments and questions
- Monitor usage patterns to improve user experience
- Detect, prevent, and address technical issues

## 4. Information Sharing

We do not sell your personal information. We may share your information:

- **With service providers** who assist in operating our service
- **For legal reasons** to comply with legal obligations
- **To protect rights** to prevent fraud or protect users
- **With your consent** for any other purpose

## 5. Data Security

We implement appropriate technical and organizational measures to protect your information:

- SSL/TLS encryption for data transmission
- Secure storage of personal information
- Regular security reviews and updates
- Access controls and authentication requirements

## 6. Data Retention

We retain your personal information for as long as necessary to:

- Provide our services to you
- Comply with legal obligations
- Resolve disputes
- Enforce our agreements

## 7. Your Privacy Rights

You have the right to:

- **Access** your personal information
- **Correct** inaccurate information
- **Delete** your account and data
- **Opt-out** of marketing communications
- **Export** your data

## 8. Children's Privacy

Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.

## 9. International Data Transfers

Your information may be transferred to countries other than your own. We ensure appropriate safeguards are in place.

## 10. Changes to This Policy

We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.

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
