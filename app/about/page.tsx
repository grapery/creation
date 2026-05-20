"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
    TreeDeciduous,
    Sparkles,
    Users,
    Palette,
    MessageSquare,
    Video,
    BookOpen,
    PenTool,
    Gamepad2,
    GraduationCap,
    Zap,
    Shield,
    Globe,
    Heart,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { githubImages } from "@/lib/github-assets";

const screenshots = [
    { src: githubImages.screenshotFragmentFeed, title: "故事碎片", desc: "记录灵感碎片，AI 辅助创作图文内容" },
    { src: githubImages.screenshotStoryboardList, title: "故事板列表", desc: "浏览和管理你的故事板作品" },
    { src: githubImages.screenshotStoryboardReader, title: "沉浸式阅读", desc: "全屏分镜阅读体验，身临其境感受故事" },
    { src: githubImages.screenshotCreateStoryboard, title: "创建故事板", desc: "AI 驱动的多步创作向导" },
    { src: githubImages.screenshotStoryDetail, title: "故事详情", desc: "查看故事全貌，管理角色和场景" },
    { src: githubImages.screenshotContributors, title: "志同道合", desc: "邀请伙伴协作创作，共同构建故事世界" },
    { src: githubImages.screenshotNotifications, title: "即时通知", desc: "实时追踪互动、关注和系统动态" },
    { src: githubImages.screenshotUserProfile, title: "个人主页", desc: "展示你的创作成果和活跃动态" },
];

export default function AboutPage() {
    const { user } = useAuth();
    const router = useRouter();

    const handleNavigate = (route: string) => {
        if (!user) {
            router.push("/login?redirect=" + encodeURIComponent(route));
        } else {
            router.push(route);
        }
    };
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="container max-w-6xl mx-auto px-4 py-20 md:py-32 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-8">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={githubImages.appIcon}
                                alt="未择"
                                className="w-24 h-24 md:w-32 md:h-32 rounded-3xl mx-auto shadow-lg shadow-primary/20"
                            />
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">AI 驱动的分支故事创作平台</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            未择
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                            用 AI 描述你想象中的故事，创造你的故事世界
                        </p>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            碎片记录灵感，故事板可视化叙事，分支探索无限剧情走向。
                            AI 辅助生成文本、图片和视频，让每个人都成为故事创作者。
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link href="/">
                                    <BookOpen className="mr-2 h-5 w-5" />
                                    探索故事
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/create">
                                    <PenTool className="mr-2 h-5 w-5" />
                                    开始创作
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Screenshots */}
            <section className="py-20">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">产品预览</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            从灵感碎片到沉浸式阅读，体验完整的创作流程
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {screenshots.map((s, i) => (
                            <div key={i} className="group">
                                <div className="rounded-xl overflow-hidden border bg-muted/30 aspect-[9/16] flex items-center justify-center mb-3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={s.src}
                                        alt={s.title}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="font-semibold text-center">{s.title}</h3>
                                <p className="text-sm text-muted-foreground text-center">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Feature - Branching Story System */}
            <section className="py-20 bg-muted/30">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                            <TreeDeciduous className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">核心特色：分支故事系统</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            独创的树状分支叙事结构，让每个故事节点都能衍生出无限可能
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-2 hover:border-primary/50 transition-colors">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                                    <TreeDeciduous className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">树状分支叙事</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>无限分支：从任意节点创建分支，探索"如果...会怎样"</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>AI 自动生成完整内容，保持故事连贯性</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>可视化树状结构，流畅切换分支</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-primary/50 transition-colors">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">碎片式灵感创作</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>随手记录灵感碎片，支持文字和图片</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>AI 根据灵感自动生成完整碎片内容</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>一键将碎片孵化为完整故事</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-primary/50 transition-colors">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">协作式分支创作</h3>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Fork 机制：创建他人故事的分支版本</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>邀请志同道合的伙伴一起协作创作</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>广场发现热门内容，关注喜欢的创作者</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Services & Features */}
            <section className="py-20">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">完整的产品功能矩阵</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            从创作到分享，提供全方位的故事创作工具和服务
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="border-2">
                            <CardContent className="p-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-3">AI 辅助创作引擎</h3>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• 自然语言描述灵感，AI 生成完整故事板</li>
                                            <li>• 多模态生成：文本、分镜图片、视频一体化</li>
                                            <li>• 支持写实、动漫、水墨等多种艺术风格</li>
                                            <li>• 漫画风格多格生成，自动排版分镜</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardContent className="p-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-3">故事板可视化叙事</h3>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• 沉浸式全屏阅读，逐页翻阅分镜画面</li>
                                            <li>• 多步骤创作向导：构思、生成、配图、发布</li>
                                            <li>• 树状分支导航，可视化探索不同剧情</li>
                                            <li>• 角色管理：塑造人物性格、外观和背景</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardContent className="p-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center flex-shrink-0">
                                        <Users className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-3">社区与互动</h3>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• 广场发现热门故事和碎片内容</li>
                                            <li>• 关注创作者，点赞、评论、收藏</li>
                                            <li>• 邀请协作，多人共建故事世界</li>
                                            <li>• 话题分区浏览，发现志同道合的伙伴</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2">
                            <CardContent className="p-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center flex-shrink-0">
                                        <Video className="w-7 h-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-3">会员与权益</h3>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li>• 多档会员计划，解锁更多 AI 创作配额</li>
                                            <li>• 支持支付宝、微信等国内主流支付</li>
                                            <li>• 高品质图片和视频导出</li>
                                            <li>• 创作数据分析和用量追踪</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Target Users */}
            <section className="py-20 bg-muted/30">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">适用人群</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            无论您是创作者、教育者还是游戏开发者，未择都能为您提供强大的支持
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-4">
                                    <PenTool className="w-8 h-8" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">内容创作者</h3>
                                <p className="text-sm text-muted-foreground">小说作者、编剧、漫画家</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">故事爱好者</h3>
                                <p className="text-sm text-muted-foreground">喜欢探索不同故事走向的读者</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center mx-auto mb-4">
                                    <GraduationCap className="w-8 h-8" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">教育工作者</h3>
                                <p className="text-sm text-muted-foreground">教学和创意写作训练</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center mx-auto mb-4">
                                    <Gamepad2 className="w-8 h-8" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">游戏开发者</h3>
                                <p className="text-sm text-muted-foreground">需要分支剧情设计的开发者</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Platform Features */}
            <section className="py-20">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">平台优势</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            为什么选择未择作为您的故事创作平台
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">技术领先</h3>
                            <p className="text-muted-foreground">
                                AI 多模态生成 + 树状分支系统，技术门槛高，难以复制
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                <Palette className="w-8 h-8" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">体验优秀</h3>
                            <p className="text-muted-foreground">
                                直观的分支导航和可视化界面，降低创作门槛
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-8 h-8" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">全平台覆盖</h3>
                            <p className="text-muted-foreground">
                                iOS / Android / Web 三端同步，随时随地创作
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">安全可靠</h3>
                            <p className="text-muted-foreground">
                                企业级安全保障，数据加密存储
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">创作者社区</h3>
                            <p className="text-muted-foreground">
                                Fork 和协作机制，形成活跃的创作者生态
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">持续创新</h3>
                            <p className="text-muted-foreground">
                                定期更新功能，引入最新 AI 技术
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            开始您的创作之旅
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            加入未择，与全球创作者一起探索无限可能的故事世界
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link href="/create">
                                    免费开始创作
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/">
                                    浏览热门故事
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h4 className="font-semibold mb-4">产品</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><button onClick={() => router.push('/plaza')} className="hover:text-foreground transition-colors text-left">广场</button></li>
                                <li><button onClick={() => router.push('/fragments')} className="hover:text-foreground transition-colors text-left">故事碎片</button></li>
                                <li><button onClick={() => handleNavigate('/create')} className="hover:text-foreground transition-colors text-left">故事板创作</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">创作</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><button onClick={() => handleNavigate('/create')} className="hover:text-foreground transition-colors text-left">创建故事</button></li>
                                <li><button onClick={() => handleNavigate('/characters/create')} className="hover:text-foreground transition-colors text-left">创建角色</button></li>
                                <li><button onClick={() => handleNavigate('/profile')} className="hover:text-foreground transition-colors text-left">个人中心</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">关于</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/about" className="hover:text-foreground transition-colors">关于我们</Link></li>
                                <li><Link href="/settings/about" className="hover:text-foreground transition-colors">App 信息</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">法律</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/terms" className="hover:text-foreground transition-colors">用户协议</Link></li>
                                <li><Link href="/privacy" className="hover:text-foreground transition-colors">隐私政策</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t text-center text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={githubImages.appIcon64} alt="未择" className="w-6 h-6 rounded-md" />
                            <span className="font-semibold">未择</span>
                        </div>
                        <p>&copy; 2025 未择. All rights reserved.</p>
                        <a
                            href="https://beian.miit.gov.cn/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground"
                        >
                            沪ICP备2025137210号
                        </a>
                    </div>
                </div>
            </footer>

        </div>
    );
}
