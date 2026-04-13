"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, Target, TrendingUp, BookOpen, Lightbulb, Compass, Sparkles } from "lucide-react";
import { useTranslation } from "@/providers/language-provider";

export function Sidebar({ className }: { className?: string }) {
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Creator Center */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <PenTool className="h-4 w-4" />
                        Creator Center
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                            <Link href="/create">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <span>Write Story</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                            <Link href="/fragments/create">
                                <Sparkles className="h-5 w-5 text-purple-500" />
                                <span>Fragment</span>
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="h-16 flex-col gap-1" asChild>
                            <Link href="/create/wizard">
                                <Target className="h-4 w-4 text-orange-500" />
                                <span className="text-xs">Storyboard</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-16 flex-col gap-1" asChild>
                            <Link href="/plaza">
                                <Compass className="h-4 w-4 text-blue-500" />
                                <span className="text-xs">Discover</span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recommended / Trending */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                        Trending Topics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { title: "Cyberpunk 2077 Lore", count: "12.5k views" },
                            { title: "Writing Prompts Daily", count: "8.2k views" },
                            { title: "Character Design Tips", count: "5.1k views" },
                            { title: "World Building 101", count: "3.4k views" }
                        ].map((item, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="text-sm font-medium group-hover:text-primary transition-colors">
                                    {item.title}
                                </div>
                                <div className="text-xs text-muted-foreground">{item.count}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="space-y-2 px-1">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <Link href="/privacy" className="hover:text-foreground">隐私政策</Link>
                    <Link href="/terms" className="hover:text-foreground">服务协议</Link>
                    <Link href="/api/v1" className="hover:text-foreground">API 文档</Link>
                </div>
                <div className="text-xs text-muted-foreground">
                    <div>© 2025 未择 Voyager Platform. All rights reserved.</div>
                    <div className="mt-1">
                        <a 
                            href="https://beian.miit.gov.cn/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-foreground"
                        >
                            沪ICP备2025137210号-1
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
