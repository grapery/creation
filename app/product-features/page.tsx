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

export default function ProductFeaturesPage() {
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

        </div>
    );
}
