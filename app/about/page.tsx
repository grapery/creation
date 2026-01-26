"use client";

import { Header } from "@/components/layout/header";
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
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function AboutPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [pendingRoute, setPendingRoute] = useState<string>("");
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    const handleNavigate = (route: string) => {
        if (!user) {
            setPendingRoute(route);
            setShowLoginPrompt(true);
        } else {
            router.push(route);
        }
    };

    const handleLoginRedirect = () => {
        setShowLoginPrompt(false);
        router.push("/login");
    };
    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">AI-Powered Storytelling Platform</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            未择 Voyager
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                            AI驱动的分支故事创作平台
                        </p>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            探索无限可能的故事世界，在每个节点创造不同的剧情走向。
                            AI辅助创作，让每个人都成为故事创作者。
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

            {/* Core Feature - Branching Story System */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
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
                                            <span>AI自动生成完整内容，保持故事连贯性</span>
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
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">互动式分支选择</h3>
                                    <ul className="space-y-2 text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>聊天驱动：与AI角色对话，选择故事分支</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>分支选择直接影响剧情发展</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>路径追踪，记录个性化故事体验</span>
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
                                            <span>Fork机制：创建他人故事的分支版本</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>多作者协作在同一故事树的不同分支创作</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span>轻松对比不同分支的内容差异</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services & Features */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">完整的产品功能矩阵</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                从创作到分享，提供全方位的故事创作工具和服务
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* AI Creation Engine */}
                            <Card className="border-2">
                                <CardContent className="p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-3">AI辅助创作引擎</h3>
                                            <ul className="space-y-2 text-muted-foreground">
                                                <li>• 自然语言输入，生成完整故事</li>
                                                <li>• 多模态生成：文本、图片、视频一体化</li>
                                                <li>• 支持写实、卡通、奇幻等多种艺术风格</li>
                                                <li>• AI智能推荐角色和场景</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Character Interaction */}
                            <Card className="border-2">
                                <CardContent className="p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center flex-shrink-0">
                                            <MessageSquare className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-3">角色互动系统</h3>
                                            <ul className="space-y-2 text-muted-foreground">
                                                <li>• 与故事中的角色进行实时对话</li>
                                                <li>• AI角色记住对话历史和上下文</li>
                                                <li>• 同时与多个角色互动，构建复杂剧情</li>
                                                <li>• 深度角色塑造：性格、背景、能力</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Social Platform */}
                            <Card className="border-2">
                                <CardContent className="p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center flex-shrink-0">
                                            <Users className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-3">社交协作平台</h3>
                                            <ul className="space-y-2 text-muted-foreground">
                                                <li>• 发布故事供他人阅读和Fork</li>
                                                <li>• 创建群组，多人协作创作</li>
                                                <li>• 评论互动，讨论故事节点</li>
                                                <li>• 关注喜欢的作者，追踪创作动态</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Media Generation */}
                            <Card className="border-2">
                                <CardContent className="p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center flex-shrink-0">
                                            <Video className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-3">多模态内容生成</h3>
                                            <ul className="space-y-2 text-muted-foreground">
                                                <li>• AI生成场景图片和角色形象</li>
                                                <li>• 自动生成故事视频</li>
                                                <li>• 多种艺术风格选择</li>
                                                <li>• 海报和宣传素材一键生成</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Target Users */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">适用人群</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                无论您是创作者、教育者还是游戏开发者，未择 Voyager都能为您提供强大的支持
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
                                    <p className="text-sm text-muted-foreground">喜欢探索不同故事走向的用户</p>
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
                </div>
            </section>

            {/* Platform Features */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">平台优势</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                为什么选择未择 Voyager作为您的故事创作平台
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-8 h-8" />
                                </div>
                                <h3 className="font-semibold text-xl mb-2">技术领先</h3>
                                <p className="text-muted-foreground">
                                    AI多模态生成 + 树状分支系统，技术门槛高，难以复制
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
                                    iOS/Android/Web三端同步，随时随地创作
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
                                    Fork和协作机制，形成活跃的创作者生态
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h3 className="font-semibold text-xl mb-2">持续创新</h3>
                                <p className="text-muted-foreground">
                                    定期更新功能，引入最新AI技术
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            开始您的创作之旅
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            加入未择 Voyager，与全球创作者一起探索无限可能的故事世界
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
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <h4 className="font-semibold mb-4">产品</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><button onClick={() => router.push('/product-features')} className="hover:text-foreground transition-colors text-left">故事探索</button></li>
                                    <li><button onClick={() => router.push('/product-features')} className="hover:text-foreground transition-colors text-left">角色库</button></li>
                                    <li><button onClick={() => router.push('/product-features')} className="hover:text-foreground transition-colors text-left">群组协作</button></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">创作</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><button onClick={() => handleNavigate('/create')} className="hover:text-foreground transition-colors text-left">创建故事</button></li>
                                    <li><button onClick={() => handleNavigate('/create?type=character')} className="hover:text-foreground transition-colors text-left">创建角色</button></li>
                                    <li><button onClick={() => handleNavigate('/profile')} className="hover:text-foreground transition-colors text-left">个人中心</button></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">关于</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><button onClick={() => setShowAboutModal(true)} className="hover:text-foreground transition-colors text-left">关于我们</button></li>
                                    <li><button onClick={() => setShowSettingsModal(true)} className="hover:text-foreground transition-colors text-left">设置</button></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">社区</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><button onClick={() => setShowTermsModal(true)} className="hover:text-foreground transition-colors text-left">用户协议</button></li>
                                    <li><button onClick={() => setShowPrivacyModal(true)} className="hover:text-foreground transition-colors text-left">隐私政策</button></li>
                                    <li><button onClick={() => setShowContactModal(true)} className="hover:text-foreground transition-colors text-left">联系我们</button></li>
                                </ul>
                            </div>
                        </div>
                        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
                            <p>&copy; 2025 未择 Voyager. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Login Prompt Dialog */}
            <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">需要登录</DialogTitle>
                        <DialogDescription className="text-base pt-4">
                            您需要登录才能使用此功能。登录后即可开始创作和探索精彩内容。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 mt-4">
                        <Button onClick={handleLoginRedirect} className="w-full">
                            前往登录
                        </Button>
                        <Button variant="outline" onClick={() => setShowLoginPrompt(false)} className="w-full">
                            取消
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* About Modal */}
            <Dialog open={showAboutModal} onOpenChange={setShowAboutModal}>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">关于我们</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">我们是谁</h3>
                            <p className="text-muted-foreground">
                                未择 Voyager 是一个创新的AI驱动分支故事创作平台。我们致力于通过人工智能技术，
                                让每个人都能轻松创造属于自己的互动故事。我们的团队由热爱故事和技术的创作者组成，
                                相信每个人内心都有精彩的故事等待被讲述。
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">我们在哪</h3>
                            <p className="text-muted-foreground">
                                我们的团队遍布全球，通过远程协作的方式为用户提供最好的创作体验。
                                无论您身在何处，都可以通过 Voyager 平台连接到全球的创作社区。
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">我们在做什么</h3>
                            <p className="text-muted-foreground">
                                我们正在构建下一代的故事创作平台，结合最新的AI技术和创新的分支叙事结构，
                                让故事创作变得更加有趣和互动。我们的目标是为创作者提供强大的工具，
                                为读者提供丰富的体验，建立一个充满活力的创作生态。
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Settings Modal */}
            <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">设置说明</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">个性化设置</h3>
                            <p className="text-muted-foreground">
                                在设置页面，您可以自定义您的创作体验：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                                <li>个人资料：编辑您的头像、昵称、简介等信息</li>
                                <li>外观设置：选择您喜欢的界面主题和显示模式</li>
                                <li>语言设置：切换界面语言，支持中文、英文、日文</li>
                                <li>通知偏好：管理您希望接收的通知类型</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">会员管理</h3>
                            <p className="text-muted-foreground">
                                查看和管理您的会员订阅：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                                <li>当前计划：查看您的会员等级和到期时间</li>
                                <li>使用情况：查看AI配额使用情况</li>
                                <li>升级会员：选择适合您的会员计划</li>
                                <li>账单管理：查看支付历史和账单信息</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">隐私与安全</h3>
                            <p className="text-muted-foreground">
                                保护您的账户安全：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                                <li>密码管理：修改登录密码</li>
                                <li>隐私设置：控制谁可以看到您的内容</li>
                                <li>数据管理：导出或删除您的数据</li>
                            </ul>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Terms Modal */}
            <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
                <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">用户协议</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4 text-sm">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">1. 服务条款</h3>
                            <p className="text-muted-foreground">
                                欢迎使用未择 Voyager平台。通过访问或使用本服务，您同意遵守这些条款。
                                如果您不同意这些条款，请不要使用本服务。
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">2. 用户责任</h3>
                            <p className="text-muted-foreground">
                                您同意使用本服务仅用于合法目的。您不得：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                                <li>上传或传输任何非法、有害、威胁性、辱骂性、骚扰性、诽谤性、粗俗、淫秽或其他令人反感的内容</li>
                                <li>冒充任何个人或实体</li>
                                <li>干扰或破坏服务或连接到服务的服务器或网络</li>
                                <li>传播病毒或任何其他可能损害服务或用户利益的代码</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">3. 知识产权</h3>
                            <p className="text-muted-foreground">
                                您保留您在平台上创作的内容的所有权。通过上传内容，您授予我们使用、修改、
                                展示和分发您内容的权利，仅用于提供和改进我们的服务。
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">4. 免责声明</h3>
                            <p className="text-muted-foreground">
                                服务按"原样"提供，不提供任何形式的明示或暗示保证。我们不对服务的准确性、
                                可靠性或完整性做出任何保证。
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Privacy Modal */}
            <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
                <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">隐私政策</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4 text-sm">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">1. 信息收集</h3>
                            <p className="text-muted-foreground">
                                我们收集您在使用服务时提供的信息，包括：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                                <li>账户信息：姓名、电子邮件地址、头像</li>
                                <li>创作内容：您创建的故事、角色、评论</li>
                                <li>使用数据：您如何使用我们的服务</li>
                                <li>设备信息：IP地址、浏览器类型、设备类型</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">2. 信息使用</h3>
                            <p className="text-muted-foreground">
                                我们使用收集的信息来：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                                <li>提供、维护和改进我们的服务</li>
                                <li>处理交易和发送相关通知</li>
                                <li>发送技术通知、更新、安全警报</li>
                                <li>响应用户的评论、问题和客户服务请求</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">3. 信息共享</h3>
                            <p className="text-muted-foreground">
                                我们不会出售或出租您的个人信息。我们可能在以下情况下共享信息：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                                <li>经您同意</li>
                                <li>为了遵守法律义务</li>
                                <li>保护和捍卫我们的权利或财产</li>
                                <li>与服务提供商合作（在保密条件下）</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">4. 数据安全</h3>
                            <p className="text-muted-foreground">
                                我们采取合理的技术和组织措施来保护您的个人信息免受未经授权的访问、
                                使用或披露。但是，没有任何传输或存储方法是完全安全的。
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Contact Modal */}
            <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">联系我们</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                        <div>
                            <h3 className="font-semibold text-lg mb-3">客服支持</h3>
                            <p className="text-muted-foreground mb-4">
                                如果您有任何问题或需要帮助，请通过以下方式联系我们：
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">电子邮件</p>
                                        <p className="text-sm text-muted-foreground">support@rankquantity.xyz</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">官方网站</p>
                                        <p className="text-sm text-muted-foreground">https://www.rankquantity.xyz</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-3">商务合作</h3>
                            <p className="text-muted-foreground">
                                对于商务合作、媒体咨询或其他商业相关事宜，请联系：
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">business@rankquantity.xyz</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-3">反馈建议</h3>
                            <p className="text-muted-foreground">
                                我们非常重视用户的反馈和建议。如果您有任何想法或建议，
                                请通过上述联系方式告诉我们，帮助我们改进产品和服务。
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
