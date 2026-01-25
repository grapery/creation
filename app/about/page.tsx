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

export default function AboutPage() {
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
                                <Link href="/stories">
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
                                <Link href="/stories">
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
                                    <li><Link href="/stories" className="hover:text-foreground transition-colors">故事探索</Link></li>
                                    <li><Link href="/characters" className="hover:text-foreground transition-colors">角色库</Link></li>
                                    <li><Link href="/groups" className="hover:text-foreground transition-colors">群组协作</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">创作</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><Link href="/create" className="hover:text-foreground transition-colors">创建故事</Link></li>
                                    <li><Link href="/create?type=character" className="hover:text-foreground transition-colors">创建角色</Link></li>
                                    <li><Link href="/profile" className="hover:text-foreground transition-colors">个人中心</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">关于</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><Link href="/about" className="hover:text-foreground transition-colors">关于我们</Link></li>
                                    <li><Link href="/settings" className="hover:text-foreground transition-colors">设置</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">社区</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><a href="#" className="hover:text-foreground transition-colors">用户协议</a></li>
                                    <li><a href="#" className="hover:text-foreground transition-colors">隐私政策</a></li>
                                    <li><a href="#" className="hover:text-foreground transition-colors">联系我们</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
                            <p>&copy; 2025 未择 Voyager. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
