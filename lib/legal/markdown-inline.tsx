export function parseInlineMarkdown(text: string) {
    let result = text;

    result = result
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    result = result.replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]+)\)/g,
        '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
}
