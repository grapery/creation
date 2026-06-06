"use client";

import Link from "next/link";
import { ArrowLeft, Headphones, Mail, MessageSquare } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SupportFeedbackForm } from "@/components/support/support-feedback-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SUPPORT_EMAIL } from "@/lib/support";

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1">
                <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b">
                    <div className="container max-w-4xl mx-auto px-4 py-16 md:py-20">
                        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
                            <Link href="/about">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                返回关于我们
                            </Link>
                        </Button>
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                <Headphones className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-3">技术支持</h1>
                                <p className="text-lg text-muted-foreground max-w-2xl">
                                    在使用未择过程中遇到问题，或希望反馈建议？请通过以下方式联系我们，我们会尽快协助您。
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 md:py-16">
                    <div className="container max-w-4xl mx-auto px-4 space-y-8">
                        <Card className="border-2 border-primary/20 bg-primary/5">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-semibold">邮件联系</h2>
                                        <p className="text-muted-foreground">
                                            需要技术支持或反馈问题，请发送邮件至：
                                        </p>
                                        <a
                                            href={`mailto:${SUPPORT_EMAIL}`}
                                            className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:underline"
                                        >
                                            {SUPPORT_EMAIL}
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            <span>您也可以填写下方表单提交反馈，我们会尽快处理。</span>
                        </div>

                        <SupportFeedbackForm />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
