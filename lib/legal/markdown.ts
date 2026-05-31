export type MarkdownBlock =
    | { type: "heading"; level: number; text: string }
    | { type: "paragraph"; text: string }
    | { type: "bullet"; items: string[] }
    | { type: "ordered"; items: string[] };

export function parseMarkdown(markdown: string): MarkdownBlock[] {
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

    for (const line of lines) {
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
            blocks.push({
                type: "heading",
                level: headingMatch[1].length,
                text: headingMatch[2].trim(),
            });
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
