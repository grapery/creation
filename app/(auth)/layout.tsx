"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { githubImages } from "@/lib/github-assets";
import { FeatureCards, OnboardingCarousel } from "@/components/marketing/feature-showcase";

type Tab = "create" | "discover";

const springSnappy = { type: "spring" as const, bounce: 0, duration: 0.35 };

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [activeTab, setActiveTab] = useState<Tab>("create");
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left — Marketing panel (ideaevo style) */}
            <div
                className="relative hidden h-full flex-col overflow-y-auto lg:flex"
                style={{ background: "var(--idea-bg)" }}
            >
                {/* Top bar */}
                <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[var(--idea-bg)]/90 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        { }
                        <Image src={githubImages.appIcon64} alt="未择" width={32} height={32} className="rounded-lg" sizes="32px" />
                        <span className="font-semibold text-base text-black">未择</span>
                    </div>

                    <div className="idea-pill-tabs" role="tablist" aria-label="营销内容切换">
                        <button
                            role="tab"
                            aria-selected={activeTab === "create"}
                            className={`idea-pill-tab ${activeTab === "create" ? "active" : ""}`}
                            onClick={() => setActiveTab("create")}
                        >
                            创作
                        </button>
                        <button
                            role="tab"
                            aria-selected={activeTab === "discover"}
                            className={`idea-pill-tab ${activeTab === "discover" ? "active" : ""}`}
                            onClick={() => setActiveTab("discover")}
                        >
                            发现
                        </button>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 px-6 pb-8 space-y-10">
                    {/* Hero */}
                    <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, transform: "translateY(12px)" }}
                        animate={{ opacity: 1, transform: "translateY(0px)" }}
                        transition={
                            shouldReduceMotion
                                ? { duration: 0 }
                                : { type: "spring", bounce: 0, duration: 0.5 }
                        }
                        className="pt-4 space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--idea-border)] text-sm text-[var(--idea-text-secondary)]">
                            <span className="w-2 h-2 rounded-full bg-[var(--idea-accent)]" />
                            AI 驱动的分支故事创作平台
                        </div>

                        <h1 className="idea-display font-bold text-black">
                            你的故事
                            <br />
                            <span className="text-[var(--idea-accent-dark)]">无限可能</span>
                        </h1>

                        <p className="text-base text-[var(--idea-text-secondary)] leading-relaxed max-w-lg">
                            探索独创的树状分支叙事结构，让每个节点都衍生出新的世界。
                            与 AI 共同谱写传奇。
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link href="/register" className="idea-btn-primary">
                                免费注册
                            </Link>
                            <Link href="/about" className="idea-btn-outline">
                                了解更多
                            </Link>
                        </div>
                    </motion.div>

                    {/* Floating toolbar hint */}
                    <div className="flex justify-center">
                        <div className="idea-floating-bar flex items-center gap-4 text-sm text-[var(--idea-text-secondary)]">
                            <span className="font-medium text-black">未择</span>
                            <span className="w-px h-4 bg-[var(--idea-border)]" />
                            <span>故事板</span>
                            <span className="w-px h-4 bg-[var(--idea-border)]" />
                            <span>分支剧情</span>
                            <span className="w-px h-4 bg-[var(--idea-border)]" />
                            <span>AI 创作</span>
                        </div>
                    </div>

                    {/* Feature cards or onboarding based on tab */}
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={activeTab}
                            initial={
                                shouldReduceMotion
                                    ? { opacity: 0 }
                                    : { opacity: 0, transform: "translateY(8px)" }
                            }
                            animate={{ opacity: 1, transform: "translateY(0px)" }}
                            exit={
                                shouldReduceMotion
                                    ? { opacity: 0 }
                                    : { opacity: 0, transform: "translateY(-6px)" }
                            }
                            transition={
                                shouldReduceMotion
                                    ? { duration: 0.15 }
                                    : springSnappy
                            }
                        >
                            {activeTab === "create" ? (
                                <FeatureCards />
                            ) : (
                                <OnboardingCarousel />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Onboarding carousel (always show below cards on create tab) */}
                    {activeTab === "create" && (
                        <motion.div
                            className="pt-4"
                            initial={shouldReduceMotion ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.25, delay: shouldReduceMotion ? 0 : 0.1 }}
                        >
                            <h2 className="idea-section-title text-lg font-semibold text-black mb-4 text-center">
                                核心功能展示
                            </h2>
                            <OnboardingCarousel />
                        </motion.div>
                    )}

                    {/* CTA */}
                    <div className="text-center space-y-4 py-6">
                        <h2 className="idea-section-title text-2xl font-bold text-black">准备好开始了吗？</h2>
                        <p className="text-[var(--idea-text-secondary)]">
                            加入未择，画出属于你的故事世界。
                        </p>
                        <Link href="/register" className="idea-btn-primary">
                            免费注册
                        </Link>
                    </div>
                </div>

                {/* Footer — legal links unchanged */}
                <div className="px-6 py-6 border-t border-[var(--idea-border)]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2">
                            { }
                            <Image src={githubImages.appIcon64} alt="未择" width={24} height={24} className="rounded-md" sizes="24px" />
                            <span className="font-semibold text-sm text-black">未择</span>
                        </div>
                        <p className="text-xs text-[var(--idea-text-muted)]">
                            © 2026 RankQuantity. All rights reserved.
                        </p>
                        <div className="idea-legal-footer flex items-center gap-4">
                            <Link href="/privacy">隐私政策</Link>
                            <span className="text-[var(--idea-border)]">|</span>
                            <Link href="/terms">服务协议</Link>
                            <span className="text-[var(--idea-border)]">|</span>
                            <a
                                href="https://beian.miit.gov.cn/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                沪ICP备2025137210号
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right — Auth form */}
            <div
                className="flex h-full items-center justify-center p-8"
                style={{ background: "var(--idea-surface)" }}
            >
                {children}
            </div>
        </div>
    );
}
