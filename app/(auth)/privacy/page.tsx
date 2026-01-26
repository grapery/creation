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
        const staticContent = `# 隐私政策

## 引言

未择 Voyager（"我们"、"平台"）非常重视用户的隐私保护和个人信息安全。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。

使用我们的服务即表示您同意本隐私政策的条款。如果您不同意本政策，请停止使用我们的服务。

**我们承诺：保护您的隐私是我们最基本的职责。我们将采取合理的技术和管理措施来保护您的个人信息安全。**

## 1. 我们收集的信息

### 1.1 您主动提供的信息

- **账户信息**：姓名、邮箱、用户名、密码
- **联系信息**：邮箱地址、电话号码
- **创作内容**：故事、故事板、角色、聊天记录
- **支付信息**：支付方式、交易记录
- **偏好设置**：语言、主题、通知偏好

### 1.2 自动收集的信息

- **设备信息**：设备类型、操作系统、浏览器类型、唯一设备标识符
- **日志信息**：IP 地址、访问时间、访问页面、点击流数据
- **使用数据**：功能使用情况、交互行为、性能数据
- **Cookie 和类似技术**：用于识别和记住用户

### 1.3 第三方信息

当您选择通过第三方账户（如微信、支付宝等）登录时，我们可能从第三方获取您授权共享的信息，如昵称、头像等。

## 2. 我们如何使用您的信息

我们使用收集的信息用于以下目的：

- **提供服务**：创建和管理您的账户，提供 AI 故事创作、角色对话等核心功能
- **改进服务**：分析使用数据，优化产品功能和用户体验
- **个性化体验**：根据您的偏好提供个性化的内容推荐
- **安全防护**：检测和防止欺诈、滥用和安全威胁
- **沟通交流**：发送服务通知、更新和营销信息（可选择退订）
- **法律合规**：遵守法律法规要求，履行法律义务
- **数据分析**：进行聚合数据分析以改进业务决策

**我们不会将您的个人信息用于本政策未明确说明的任何其他目的。**

## 3. 信息共享

除以下情况外，我们不会与第三方共享您的个人信息：

### 3.1 获得您的同意

在获得您明确同意的情况下，我们可以与第三方共享您的信息。

### 3.2 服务提供商

我们可能与以下可信第三方合作提供服务：

- **云服务提供商**：如阿里云、腾讯云等，用于数据存储和计算
- **AI 服务提供商**：如 OpenAI、智谱 AI 等，用于 AI 内容生成
- **支付处理商**：如支付宝、微信支付等，处理支付交易
- **分析服务商**：用于分析应用性能和用户行为

这些第三方只能访问其履行职责所需的个人信息，且必须遵守保密义务。

### 3.3 法律要求

- 遵守法律法规、法院命令或政府要求
- 保护我们的权利、财产或安全
- 防止欺诈、滥用或非法活动

### 3.4 业务转让

在合并、收购或资产转让的情况下，您的信息可能作为资产的一部分被转让。我们将提前通知您。

### 3.5 公开信息

您选择公开分享的内容（如公开发布的故事）将对其他用户可见。请谨慎分享个人信息。

## 4. 数据安全

我们采取多层次的安全措施保护您的信息：

### 4.1 技术措施

- **加密传输**：使用 HTTPS/SSL 加密所有数据传输
- **加密存储**：敏感数据（如密码）使用高强度加密算法存储
- **访问控制**：严格的权限管理和身份验证机制
- **安全审计**：定期进行安全审计和漏洞扫描
- **入侵检测**：部署入侵检测和防御系统

### 4.2 管理措施

- 只有授权人员才能访问个人信息
- 员工接受隐私和安全培训
- 签署保密协议
- 建立数据泄露应急响应机制

### 4.3 数据保留

- 我们只在实现目的所需的时间内保留您的个人信息
- 账户注销后，我们将在 30 天内删除或匿名化您的个人信息
- 法律要求必须保留的信息除外

**尽管我们采取了合理的安全措施，但没有任何系统是 100% 安全的。我们建议您采取额外措施保护账户安全，如使用强密码、启用两步验证等。**

## 5. 您的权利

根据适用的隐私法律，您享有以下权利：

- **🔍 访问权**：您有权要求我们提供关于您个人信息的副本，了解我们如何收集、使用和共享您的信息。
- **✏️ 更正权**：您有权要求更正不准确或不完整的信息。您也可以直接在账户设置中更新某些信息。
- **🗑️ 删除权**：在特定条件下，您有权要求我们删除您的个人信息。您也可以直接注销账户。
- **⏸️ 限制处理权**：在特定条件下，您可以要求我们限制处理您的个人信息。
- **📦 数据可携权**：您有权要求以结构化、常用格式获取您的信息，并将其转移到其他服务。
- **🚫 反对权**：您有权反对我们基于合法利益处理您的信息，包括营销追踪。
- **🔄 撤回同意**：如果我们基于您的同意处理信息，您有权随时撤回同意。
- **⚖️ 投诉权**：您有权向相关数据保护监管机构投诉我们的数据处理方式。

### 如何行使您的权利

您可以通过以下方式行使您的权利：

- 通过账户设置直接管理某些信息和偏好
- 发送电子邮件至 **privacy@grapery.xyz**
- 通过"帮助中心"提交请求

我们将在收到您的请求后 **30 天内**回复。某些请求可能需要验证您的身份。

## 6. Cookie 和追踪技术

### 6.1 Cookie 的使用

我们使用 Cookie 和类似技术来：

- 记住您的登录状态和偏好
- 分析应用性能和用户行为
- 个性化内容和广告
- 改善用户体验

### 6.2 Cookie 类型

- **必要 Cookie**：应用正常运行所必需，无法禁用
- **性能 Cookie**：收集应用使用信息，帮助我们改进
- **功能 Cookie**：记住您的选择和偏好
- **营销 Cookie**：用于提供相关广告（可选择禁用）

### 6.3 管理 Cookie

您可以通过浏览器设置管理 Cookie。请注意，禁用某些 Cookie 可能影响应用功能。

## 7. 第三方服务

我们的服务可能包含或链接到第三方网站和服务。这些第三方有自己的隐私政策，我们不对其隐私实践负责。

常见的第三方服务包括：

- **AI 内容生成**：OpenAI、智谱 AI 等
- **支付处理**：支付宝、微信支付等
- **社交登录**：微信、QQ、支付宝等
- **数据分析**：Google Analytics、友盟等
- **客户服务**：在线客服系统

**我们建议您查看这些第三方的隐私政策，了解他们如何处理您的信息。**

## 8. 儿童隐私

我们的服务面向 14 岁及以上用户。我们不会故意收集 14 岁以下儿童的个人信息。

- 如果我们发现无意中收集了儿童的信息，我们将立即删除
- 如果您是家长或监护人，发现您的孩子向我们提供了信息，请联系我们
- 我们会在验证后采取适当措施删除相关信息

## 9. 国际数据传输

您的个人信息主要存储在中国境内的服务器上。在某些情况下，为了提供服务，您的信息可能被传输到其他国家/地区。

在跨境传输时，我们将：

- 确保接收方提供充分的数据保护水平
- 采取适当的安全措施
- 遵守适用的数据传输法律要求
- 获得您的必要同意（如法律要求）

## 10. 隐私政策的变更

我们可能会不时更新本隐私政策。更新后的政策将在应用内公布，并标注最后更新日期。

- 重大变更将通过电子邮件或应用内通知告知您
- 继续使用服务即表示您接受更新后的政策
- 建议您定期查看本政策以了解最新信息

**何时构成重大变更：**

- 改变我们收集、使用或共享信息的方式
- 影响您的基本权利或自由
- 法律或监管要求通知的重大变化

## 11. 联系我们

如果您对本隐私政策有任何疑问、意见或请求，或想要行使您的隐私权利，请通过以下方式联系我们：

- 隐私负责人邮箱：**privacy@grapery.xyz**
- 一般咨询邮箱：**support@grapery.xyz**
- 在线客服：通过应用的"帮助中心"联系我们
- 邮寄地址：上海市浦东新区[具体地址]（请先通过电子邮件联系我们）

### 数据保护官

我们已指定数据保护官（DPO）负责隐私相关事务。如需联系 DPO，请在邮件主题中注明"隐私咨询"。

### 响应时间

- 一般咨询：我们将在 **5 个工作日内**回复
- 隐私权利请求：我们将在 **30 天内**处理并回复
- 数据泄露通知：如发生影响您权益的数据泄露，我们将在 **72 小时内**通知您

## 12. 隐私原则总结

我们的隐私保护基于以下核心原则：

- **透明性**：清晰说明我们如何使用您的信息
- **合法性**：仅在合法基础上处理您的信息
- **最小化**：只收集实现目的所需的最少信息
- **安全性**：采取适当措施保护您的信息安全
- **用户控制**：尊重并保护您对信息的控制权
- **问责制**：对我们的隐私实践负责

**我们承诺持续改进我们的隐私和数据保护实践，确保您的个人信息得到最大程度的保护。**`;

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
        </div>
    );
}

function parseInlineMarkdown(text: string) {
    // Simple inline markdown parsing for bold and links
    let result = text;

    // Bold: **text**
    result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Links: [text](url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
}
