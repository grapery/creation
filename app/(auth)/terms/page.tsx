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
                const response = await fetch("/api/legal/terms");
                if (response.ok) {
                    const data = await response.json();
                    if (typeof data.content === "string" && data.content.trim()) {
                        setContent(parseMarkdown(data.content));
                        setLastUpdated(data.lastUpdated || "");
                    } else {
                        loadStaticContent();
                    }
                } else {
                    loadStaticContent();
                }
            } catch {
                loadStaticContent();
            } finally {
                setIsLoading(false);
            }
        }

        loadTerms();
    }, []);

    function loadStaticContent() {
        const staticContent = `# 服务协议

## 1. 协议的接受与适用

欢迎使用**未择**。在注册、登录、访问或使用未择平台及相关服务前，请您仔细阅读并充分理解本服务协议（以下简称"本协议"）。您一旦以任何方式使用本平台，即表示您已阅读、理解并同意受本协议约束。

如果您不同意本协议的任何内容，请立即停止使用本平台服务。我们可能根据业务发展、法律法规变化或产品调整不定期更新本协议，并在平台页面公示。更新后的协议一经公示即生效；您继续使用服务的，视为接受更新后的协议。

## 2. 服务内容

### 2.1 核心功能

未择是一个 **AI 驱动的分支故事创作平台**，帮助用户以树状结构构建开放式叙事世界。平台可能提供的功能包括：

- **AI 辅助创作**：辅助生成、续写、改写和扩展故事内容，帮助您更快捕捉灵感
- **分支叙事结构**：支持树状故事节点、多线剧情分叉和不同故事走向的组织管理
- **角色与世界观管理**：创建角色、设定背景、整理人物关系和故事设定
- **故事板编辑**：以可视化方式梳理故事结构、节点关系和创作进度
- **多媒体内容生成**：在可用范围内生成插图、场景图或其他辅助素材
- **社区与协作能力**：发布作品、浏览内容、互动交流或与他人协同创作

### 2.2 服务调整

我们会持续优化平台能力。因产品迭代、技术维护、第三方服务变更、法律监管要求或不可抗力等原因，我们可能新增、调整、暂停或终止部分服务。对于可能显著影响您权益的变更，我们将尽合理努力通过页面公告、站内通知或其他合适方式提醒您。

## 3. 账户注册与安全

### 3.1 账户注册要求

- 注册时请提供**真实、准确、完整**的信息，并在信息发生变化时及时更新
- 请妥善保管账号、密码、验证码及第三方登录凭证，不得转让、出借或共享账户
- 不得冒用、盗用他人身份信息或以自动化方式批量注册、登录、使用本平台

### 3.2 账户安全责任

您应对自己账户下发生的全部活动负责。若发现账号被盗、异常登录或存在其他安全风险，请立即修改密码并通过本协议列明的联系方式通知我们。因您未妥善保管账户信息、主动共享账户或使用不安全网络环境造成的损失，由您自行承担。

### 3.3 账户暂停与注销

如您违反本协议、社区规则或相关法律法规，或账户存在欺诈、攻击、刷量、恶意注册等风险行为，我们有权视情况采取限制功能、隐藏内容、暂停使用、注销账户等措施，并保留依法追究责任的权利。

## 4. 未成年人使用

如您未满 18 周岁，应在监护人同意和指导下使用本平台。未成年人不得使用与其年龄、心智成熟程度不相适应的内容或功能，不得进行未经监护人同意的付费购买。监护人应关注未成年人的网络使用行为，并对其使用本平台的行为承担监护责任。

## 5. 用户行为规范

### 5.1 鼓励的行为

- 积极创作富有想象力的原创故事，与社区共同构建丰富的叙事宇宙
- 友善、尊重地与其他用户交流互动，维护良好的创作氛围
- 提供建设性的反馈与建议，帮助平台持续改进
- 自觉遵守平台社区规范及相关法律法规

### 5.2 严格禁止的行为

您不得利用本平台从事以下行为：

- 发布、传播违法、虚假、有害、威胁、侮辱、骚扰、诽谤、歧视、色情、赌博、暴力或违反公序良俗的内容
- 抄袭、盗用、搬运他人作品，或侵犯他人著作权、商标权、肖像权、名誉权、隐私权及其他合法权益
- 发布或诱导生成违法违规、侵权、仇恨、暴力、成人或其他不适宜内容
- 散布病毒、木马、恶意脚本，或实施爬虫抓取、反向工程、破解、绕过安全机制等行为
- 以任何方式攻击、干扰、过载、破坏平台系统或影响其他用户正常使用
- 利用平台实施诈骗、非法营销、洗钱、非法集资、刷量刷单或其他违法违规商业行为
- 对其他用户进行恐吓、骚扰、人肉搜索、恶意举报或网络暴力

## 6. 内容审核与处置

### 6.1 审核与安全机制

我们尊重创作自由，但也会依法依规维护平台秩序。对于涉嫌违法违规、侵权、不适宜公开展示或违反平台规则的内容，我们有权在不事先通知的情况下采取提醒修改、限制展示、下架删除、限制发布、封禁账户等措施。若相关内容涉及第三方投诉、行政监管或司法机关要求，我们可能依法配合处理并保存必要记录。

### 6.2 举报、屏蔽与申诉

为满足移动应用商店对用户生成内容的安全要求，平台将提供或持续完善举报、拉黑、屏蔽、限制互动等能力。您可以通过内容页面、用户页面、平台内反馈入口或客服邮箱举报违法违规、侵权、骚扰或其他令人反感的内容和用户。我们会在收到举报后尽快核查，并依据规则采取必要措施。若您认为内容或账户处置存在误判，也可以通过客服邮箱提交申诉。

### 6.3 不当内容零容忍

对于儿童性剥削、恐怖主义、极端暴力、仇恨煽动、严重骚扰、明显侵权、违法交易、恶意欺诈等严重违规内容或行为，我们采取零容忍政策，并可能立即删除内容、封禁账户、保存证据并依法向主管机关报告。

## 7. 知识产权

### 7.1 平台权利声明

未择平台及其所有相关内容，包括但不限于品牌标识、界面设计、技术架构、文字素材、图像资源及源代码，均受中华人民共和国著作权法及其他知识产权法律的保护，归本平台或相应权利人所有。未经书面授权，任何人不得擅自复制、修改、传播或用于商业用途。

### 7.2 用户创作内容

- 您对自己在平台上独立创作并依法享有权利的内容保留相应知识产权
- 您在平台上传、发布或公开展示内容，即表示授予我们**全球范围内、非独家、免费、可转授权**的许可，用于存储、展示、分发、推广、改进服务及履行本协议
- 您承诺对发布内容拥有合法权利或充分授权，且内容不会侵犯任何第三方权益
- 您删除内容后，我们将按照产品机制和法律要求处理；但已被其他用户合理引用、备份、缓存或依法留存的内容可能无法立即完全删除

### 7.3 AI 协同创作内容

对于您借助平台 AI 功能生成或加工的内容，您可在法律允许范围内使用。AI 生成内容可能存在事实错误、风格相似、权利归属不确定或不符合特定用途的问题。您在发布、传播或商业使用前，应自行审查内容的合法性、准确性和权利风险。

## 8. 隐私保护

保护您的个人信息是我们的重要责任。关于我们的数据收集范围、使用目的及保护措施，请参阅我们的 [隐私政策](/privacy)。

- 我们仅收集提供服务所必要的最小范围个人信息
- 我们采用行业标准的加密和访问控制措施，保障您的数据安全
- 未经您明确授权，我们不会将您的个人信息出售或出租给第三方
- 您可依法查询、更正、复制、删除个人信息，或撤回部分授权
- 您可通过平台内账户设置或客服邮箱申请注销账户、删除个人信息；我们将在核验身份后依法处理

## 9. 付费服务与结算

### 9.1 会员与定价

平台可能提供免费功能、会员服务、点数服务、订阅服务或其他付费功能。具体价格、权益、有效期、自动续订规则、使用限制和适用范围，以购买页面或订单页面展示为准。我们可能根据运营情况调整价格或权益，并在合理范围内提前告知。

### 9.2 支付方式

- 平台可能支持支付宝、微信支付、Apple App Store 应用内购买、Google Play 结算系统等支付方式
- 请确保您使用的支付账户合法有效，且对该账户拥有合法使用权
- 支付过程由第三方支付机构或支付通道处理，请同时遵守其服务规则

### 9.3 退款政策

**付费服务一经购买或激活，原则上不支持无理由退款。** 若因平台自身原因导致服务严重不可用，或购买页面明确承诺的核心权益无法提供，您可在购买后 **7 个自然日内**通过客服邮箱提交退款申请。我们将在核实后按原支付路径或双方认可的方式处理。

通过 Apple App Store 或 Google Play 完成的购买、退款、取消订阅及账单争议，通常需按照 Apple 或 Google 的规则和流程处理。我们无法直接控制应用商店的退款审核结果，但会在必要范围内提供订单核验和客服协助。

### 9.4 自动续订与取消

如您购买自动续订订阅服务，订阅将在当前周期结束前按照购买页面展示的规则自动续费，除非您在相应应用商店或支付渠道规定的时间前取消。您可在 Apple ID 订阅管理、Google Play 订阅管理或对应支付渠道中取消自动续订。卸载应用、删除账户或停止使用服务，通常不会自动取消已经开通的订阅，请务必前往对应平台完成取消操作。

## 10. 免责声明

### 10.1 服务现状声明

未择平台以"现有状态"提供服务，在法律允许的最大范围内，我们不对以下事项作出明示或暗示的保证：

- 服务持续运行、零中断或完全无错误
- AI 生成内容在创意、准确性或适用性方面满足您的特定期望
- 平台服务器、网络和数据存储系统在任何情况下均不受攻击、故障或数据丢失影响

### 10.2 责任范围限制

在适用法律允许的范围内，对于以下情形产生的损失，我们不承担赔偿责任：

- 因不可抗力、网络故障、第三方服务中断、监管要求等原因导致的服务中止或异常
- 您使用或无法使用本平台服务所造成的间接、附带或衍生损失
- AI 辅助生成内容存在偏差或不符合预期而引发的损失
- 在任何情形下，我们的最高赔偿责任不超过您在争议发生前 **12 个月**内实际向我们支付的服务费用总额

## 11. 服务终止

### 11.1 用户主动终止

您可以随时停止使用本平台，并根据平台提供的路径申请注销账户。注销前，请自行备份需要保留的内容。账户注销完成后，我们将依据隐私政策、法律法规及必要的数据留存要求处理您的账户信息和相关内容。

### 11.2 平台终止服务

在以下情形下，我们有权暂停或终止向您提供服务，且不承担任何赔偿责任：

- 您违反本协议的任何实质性条款
- 您的账户涉嫌欺诈、违法、恶意刷量或其他有害行为
- 因法律法规、政府监管或司法裁决的要求
- 平台决定停止运营或重大业务调整

## 12. 争议解决

### 12.1 准据法

本协议的订立、效力、解释及履行，均适用**中华人民共和国**内地法律，排除其冲突法规则的适用。

### 12.2 协商与诉讼

- 如因使用本平台或本协议产生任何争议，双方应首先本着诚信原则进行友好协商，争取妥善解决
- 协商未果的，任何一方均可向**上海市**有管辖权的人民法院提起诉讼
- 争议解决期间，双方应继续履行本协议中不受争议影响的其他义务

## 13. 第三方服务与应用商店条款

本平台可能依赖第三方账号登录、支付、云服务、AI 模型、推送通知、数据分析或应用分发平台。您在使用相关功能时，除遵守本协议外，还应遵守第三方服务方适用的服务条款和隐私规则。

当您通过 iOS App Store 或 Android Google Play 下载、安装、购买或订阅本应用时，还应遵守 Apple Media Services Terms and Conditions、Google Play Terms of Service 以及相应平台发布的政策。Apple 和 Google 不是本协议的当事方，不负责本平台内容、服务、维护、支持、争议或用户生成内容管理；但在适用法律允许范围内，Apple、Google 及其关联方可能作为其平台条款的受益方享有相应权利。

## 14. 通用条款

### 14.1 完整性

本协议与我们的隐私政策共同构成您与未择平台之间关于使用服务的完整法律文件，取代双方此前达成的任何口头或书面协议。

### 14.2 可分割性

若本协议任一条款被有权机构认定为无效或不可执行，该条款将在最小范围内调整以实现其原始目的，其余条款继续完全有效。

### 14.3 权利不放弃

我们未能及时行使或执行本协议中的任何权利，不构成对该权利的放弃，亦不影响我们日后行使该权利。

### 14.4 协议转让

未经我们事先书面同意，您不得以任何形式转让本协议项下的权利或义务。我们可在合法范围内将本协议转让给关联公司或业务继承方，并会提前通知您。

## 15. 联系我们

如您对本协议有任何疑问、意见或建议，欢迎通过以下方式与我们取得联系，我们将在收到您的反馈后 **3 个工作日内**予以回复：

- 客服邮箱：**suoshu@grapery.xyz**
- 平台内反馈：登录后前往"设置 > 帮助与反馈"提交您的问题
- 官方网站：[www.rankquantity.xyz](https://www.rankquantity.xyz)

感谢您对未择的支持与信任。愿我们共同在这个不断分叉的故事世界里，探索更多可能。`;

        setContent(parseMarkdown(staticContent));
        setLastUpdated("2026年5月31日");
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
                    服务协议
                </h1>
                {lastUpdated && (
                    <p className="text-muted-foreground mt-1">
                        最后更新：{lastUpdated}
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

    // Links: [text](url) - allow http(s), mailto, and site-relative URLs.
    result = result.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    return <span dangerouslySetInnerHTML={{ __html: result }} />;
}
