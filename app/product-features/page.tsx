"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import {
    BookOpen,
    Users,
    Sparkles,
    MessageSquare,
    Video,
    TreeDeciduous,
    PenTool,
    Zap,
    Shield,
    Globe,
    Heart,
    CheckCircle2,
    ArrowRight,
    Crown,
    Database,
    Bot,
    Image,
    Languages
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

export default function ProductFeaturesPage() {
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
                            <span className="text-sm font-medium">Product Features</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            产品特性
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                            AI驱动的分支故事创作平台
                        </p>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            探索无限可能的故事世界，在每个节点创造不同的剧情走向。
                            AI辅助创作，让每个人都成为故事创作者。
                        </p>
                    </div>
                </div>
            </section>

            {/* Product Features - Story Exploration */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 mb-4">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">故事探索</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                发现海量精彩故事，体验不同创作者的想象力
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="border-2 hover:border-blue-500/50 transition-colors">
                                <CardContent className="p-8">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">发现热门故事</h3>
                                    <p className="text-muted-foreground mb-4">
                                        浏览社区创作的故事，发现你喜欢的内容
                                    </p>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span>实时热门推荐</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span>多维度分类浏览</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span>智能内容推荐</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-2 hover:border-blue-500/50 transition-colors">
                                <CardContent className="p-8">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                                        <TreeDeciduous className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">分支剧情体验</h3>
                                    <p className="text-muted-foreground mb-4">
                                        在每个故事节点选择不同分支，体验不同结局
                                    </p>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span>可视化剧情树</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span>流畅分支切换</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span>收藏喜欢的分支</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-2 hover:border-blue-500/50 transition-colors">
                                <CardContent className="p-8">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                                        <Heart className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">互动与分享</h3>
                                    <p className="text-muted-foreground mb-4">
                                        为喜欢的故事点赞、评论，与创作者互动
                                    </p>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span>点赞评论系统</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span>分享到社交媒体</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span>关注喜欢的创作者</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Character Library */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-500 mb-4">
                                <Users className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">角色库</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                丰富的角色资源，为你的故事增添活力
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="border-2 hover:border-purple-500/50 transition-colors">
                                <CardContent className="p-8">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">AI角色生成</h3>
                                    <p className="text-muted-foreground mb-4">
                                        使用AI快速生成个性化角色
                                    </p>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <span>智能性格设定</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <span>多样化外观描述</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <span>背景故事生成</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <span>多语言支持</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-2 hover:border-purple-500/50 transition-colors">
                                <CardContent className="p-8">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">角色互动</h3>
                                    <p className="text-muted-foreground mb-4">
                                        与AI角色进行实时对话互动
                                    </p>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <span>沉浸式对话体验</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <span>角色记忆保持</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <span>情感理解与回应</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <span>多角色群聊</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Group Collaboration */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 text-green-500 mb-4">
                                <Users className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">群组协作</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                与其他创作者一起协作，创作更精彩的故事
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="border-2 hover:border-green-500/50 transition-colors">
                                <CardContent className="p-8">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">团队创作</h3>
                                    <p className="text-muted-foreground mb-4">
                                        组建创作团队，多人共同创作一个故事
                                    </p>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>角色权限管理</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>实时协作编辑</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>版本历史记录</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-2 hover:border-green-500/50 transition-colors">
                                <CardContent className="p-8">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">创意交流</h3>
                                    <p className="text-muted-foreground mb-4">
                                        在群组内分享创意，讨论剧情走向
                                    </p>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>群组讨论区</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>创意投票机制</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>活动时间线</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-2 hover:border-green-500/50 transition-colors">
                                <CardContent className="p-8">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">群组管理</h3>
                                    <p className="text-muted-foreground mb-4">
                                        完善的群组管理功能，保护创作环境
                                    </p>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>黑名单机制</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>邀请审核系统</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>成员角色管理</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">开始创作你的故事</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            加入我们的创作社区，探索AI辅助叙事的无限可能
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" onClick={() => handleNavigate("/create")}>
                                <PenTool className="mr-2 h-5 w-5" />
                                开始创作
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => handleNavigate("/stories")}>
                                <BookOpen className="mr-2 h-5 w-5" />
                                浏览故事
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

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
