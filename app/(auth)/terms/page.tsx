"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";

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
        const staticContent = `# 服务协议

## 1. 服务条款的接受

欢迎使用 未择 Voyager 平台！感谢您选择我们的服务。在使用我们的服务之前，请仔细阅读并理解本服务协议（以下简称"协议"）。通过访问或使用 未择 Voyager 平台，即表示您同意接受本协议的所有条款和条件。

如果您不同意本协议的任何部分，请立即停止使用我们的服务。我们保留随时修改本协议的权利，修改后的协议将在平台上公布，继续使用服务即表示您接受修改后的协议。

## 2. 服务描述

### 2.1 核心服务

未择 Voyager 是一个 **AI 驱动的故事创作协作平台**，提供以下主要服务：

- **AI 故事创作**：利用人工智能技术生成和续写故事内容
- **分支叙事系统**：支持多分支剧情创作和树状故事结构
- **角色管理**：创建和管理虚拟角色，进行角色对话
- **故事板编辑**：可视化编辑故事结构和剧情走向
- **AI 内容生成**：生成图片、视频等多媒体内容
- **协作功能**：与团队成员协作创作故事

### 2.2 服务变更

我们保留随时修改或中断服务的权利，恕不另行通知。我们不对服务的任何修改、暂停或终止承担责任。

## 3. 用户账户与安全

### 3.1 账户注册

- 您必须提供 **真实、准确、完整** 的注册信息
- 您有责任维护账户信息的准确性和时效性
- 您需要创建安全的密码并妥善保管账户信息
- 禁止未经授权使用他人的账户

### 3.2 账户安全

您对使用您账户进行的所有活动负责。如果您发现任何未经授权使用您账户的情况，应立即通知我们。我们对因您未能保护账户信息而造成的损失不承担责任。

### 3.3 账户终止

我们保留暂停或终止您账户的权利，如果您违反本协议或从事任何欺诈、非法或有害活动。

## 4. 用户行为规范

### 4.1 允许的行为

- 创作原创故事内容并分享给社区
- 与其他用户友好交流和协作
- 提供反馈和建议以改进服务
- 遵守社区准则和平台规则

### 4.2 禁止的行为

**严格禁止以下行为：**

- 上传、发布或传播任何违法、有害、威胁、辱骂、骚扰、侵权、诽谤或其他不当内容
- 侵犯他人的知识产权、隐私权或其他权利
- 传播病毒、恶意代码或其他有害技术
- 未经授权访问或破坏平台的任何部分
- 利用平台进行商业欺诈或非法活动
- 骚扰、威胁或恐吓其他用户
- 发布色情、暴力、歧视或其他不当内容

## 5. 知识产权

### 5.1 平台知识产权

未择 Voyager 平台的所有内容、功能和设计，包括但不限于文字、图形、标识、图像、软件、代码等，均受知识产权法保护，归我们或我们的许可方所有。

### 5.2 用户内容

- 您保留对您在平台上创作的原始内容的所有权
- 通过在平台上发布内容，您授予我们 **使用、复制、修改、展示和分发** 该内容的许可，以提供和改进我们的服务
- 您声明并保证您拥有发布内容的所有权利和许可
- 您应对您发布的内容承担全部责任

### 5.3 AI 生成内容

对于 AI 生成的内容，您拥有使用权，但应遵守相关法律法规和平台规则。AI 生成内容的版权归属可能因国家/地区法律而异，请咨询当地法律专业人士。

## 6. 隐私保护

我们非常重视您的隐私。关于我们如何收集、使用和保护您的个人信息，请参阅我们的 [隐私政策](/privacy)。

- 我们会收集必要的个人信息以提供服务
- 我们会采取合理的安全措施保护您的信息
- 我们不会在未经您同意的情况下出售您的个人信息
- 您有权访问、更正和删除您的个人信息

## 7. 付费服务

### 7.1 定价

我们提供免费和付费服务。付费服务的价格可能会不时变更，恕不另行通知。所有价格均以人民币显示。

### 7.2 支付

- 我们支持多种支付方式，包括支付宝、微信支付等
- 您确认您有权使用您提供的支付方式
- 所有交易均通过安全的支付网关处理

### 7.3 退款政策

**一般情况下，付费服务一经购买不支持退款。如果服务存在重大缺陷或未能提供承诺的服务，您可以在购买后 7 天内申请退款。退款将通过原始支付方式退回。**

## 8. 免责声明

### 8.1 服务"按原样"提供

未择 Voyager 平台按"按原样"和"按可用"基础提供服务，不提供任何明示或暗示的保证，包括但不限于：

- 服务的 **不间断性、及时性、安全性或无错误性**
- 服务结果的准确性或可靠性
- 服务器或软件无病毒或其他有害组件

### 8.2 责任限制

在任何情况下，我们都不对以下情况承担责任：

- 任何间接、偶然、特殊、后果性或惩罚性损害
- 利润损失、数据丢失、商业机会丧失
- 服务的使用或无法使用导致的任何损失
- 总金额超过您在过去 12 个月内支付给我们的金额

## 9. 服务终止

### 9.1 您可以终止服务

您可以随时停止使用服务并删除您的账户。删除账户后，您的个人信息和内容将根据我们的数据保留政策处理。

### 9.2 我们可以终止服务

我们保留在以下情况下暂停或终止您的账户和服务的权利：

- 您违反本协议的任何条款
- 您从事欺诈、非法或有害活动
- 我们决定停止提供服务
- 法律或监管要求我们这样做

## 10. 争议解决

### 10.1 适用法律

本协议受中华人民共和国法律管辖，并按其解释（不包括法律冲突原则）。

### 10.2 争议解决

- 任何因本协议引起的争议应首先通过友好协商解决
- 如果协商不成，任何一方可向上海市有管辖权的法院提起诉讼
- 在争议解决期间，双方应继续履行本协议中不受争议影响的部分

## 11. 其他条款

### 11.1 完整协议

本协议构成您与我们之间关于使用服务的完整协议，取代之前的任何口头或书面协议。

### 11.2 可分割性

如果本协议的任何条款被认定为无效或不可执行，该条款应被视为可分割，其余条款仍然有效。

### 11.3 放弃

我们未能执行本协议的任何条款不应被视为放弃该条款。

### 11.4 转让

未经我们事先书面同意，您不得转让本协议。我们可以自由转让本协议。

## 12. 联系我们

如果您对本协议有任何疑问、意见或建议，请通过以下方式联系我们：

- 电子邮件：**support@grapery.xyz**
- 在线客服：通过平台的"帮助中心"联系我们
- 邮寄地址：上海市浦东新区[具体地址]（请先通过电子邮件联系我们）

我们将在收到您的联系后 **5 个工作日内**回复您。`;

        setContent(parseMarkdown(staticContent));
        setLastUpdated("2025年1月15日");
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
        <div className="container max-w-6xl px-4 py-6 mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    Terms of Service
                </h1>
                {lastUpdated && (
                    <p className="text-muted-foreground mt-1">
                        Last Updated: {lastUpdated}
                    </p>
                )}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20 text-destructive">
                    {error}
                </div>
            ) : (
                <Card className="border shadow-sm">
                    <CardContent className="space-y-6 p-6">
                        {/* Document Content */}
                        <div className="space-y-6">
                            {content.map((block, index) => (
                                <div key={index}>
                                    {block.type === "heading" && (
                                        <h2 className={`font-bold ${block.level === 1 ? "text-3xl" :
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
    );
}

function parseInlineMarkdown(text: string) {
    // Simple inline markdown parsing for bold and links
    let result = text;

    // Sanitize HTML entities first
    result = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    // Bold: **text**
    result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Links: [text](url) — only allow http/https/mailto URLs
    result = result.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
}
