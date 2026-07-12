"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { githubImages } from "@/lib/github-assets";
import { imageCache, useCachedImage } from "@/lib/image-cache";
import Link from "next/link";

const FEATURE_CARDS = [
    {
        title: "创作故事世界",
        desc: "用 AI 描述你想象中的故事，树状分支探索无限剧情走向。",
        cta: "开始创作",
        href: "/create",
        bgClass: "idea-feature-card-yellow",
    },
    {
        title: "漫画与分镜",
        desc: "可视化故事板，AI 生成分镜图片，沉浸式阅读体验。",
        cta: "探索故事板",
        href: "/plaza",
        bgClass: "idea-feature-card-green",
    },
    {
        title: "协作与分享",
        desc: "邀请伙伴共同创作，Fork 机制让好创意被更多人看见。",
        cta: "加入社区",
        href: "/register",
        bgClass: "idea-feature-card-cyan",
    },
];

const ONBOARDING_SLIDES = [
    {
        title: "创作漫画和平面设计作品",
        desc: "把你的生活变成连环漫画，为他人制作生日贺卡，并创建活动邀请函。",
        img: githubImages.storyOverview,
    },
    {
        title: "故事全览",
        desc: "直观的故事概览界面，清晰展示故事的开端、发展与走向。",
        img: githubImages.storyboard,
    },
    {
        title: "分支剧情系统",
        desc: "独创的树状分支结构，每一个选择都通向不同的平行宇宙。",
        img: githubImages.branching,
    },
    {
        title: "角色深度塑造",
        desc: "AI 驱动的角色系统，赋予每个角色独特的性格、记忆和声音。",
        img: githubImages.roles,
    },
    {
        title: "多人实时协作",
        desc: "邀请好友共同创作，在同一棵故事树上开枝散叶。",
        img: githubImages.collaboration,
    },
];

const springSnappy = { type: "spring" as const, bounce: 0, duration: 0.35 };
const fadeFast = { duration: 0.2, ease: [0.23, 1, 0.32, 1] as const };

function CachedSlideImage({ src, alt }: { src: string; alt: string }) {
    const { src: cachedSrc, isLoading } = useCachedImage(src);

    if (isLoading) {
        return (
            <div className="w-full aspect-[4/3] bg-[var(--idea-selection)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--idea-border)] border-t-[var(--idea-text)] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={cachedSrc || src}
            alt={alt}
            className="w-full aspect-[4/3] object-cover"
        />
    );
}

export function FeatureCards() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURE_CARDS.map((card, i) => (
                <motion.div
                    key={card.title}
                    className={`idea-feature-card ${card.bgClass}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, transform: "translateY(12px)" }}
                    whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={
                        shouldReduceMotion
                            ? { duration: 0 }
                            : { ...springSnappy, delay: i * 0.05 }
                    }
                >
                    <h3 className="text-2xl font-bold text-black mb-3 leading-tight tracking-tight">
                        {card.title}
                    </h3>
                    <p className="text-sm text-black/80 leading-relaxed flex-1">
                        {card.desc}
                    </p>
                    <Link
                        href={card.href}
                        className="idea-btn-outline mt-6 self-start bg-black/[0.06] border-black"
                    >
                        {card.cta}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}

export function OnboardingCarousel() {
    const [current, setCurrent] = useState(0);
    const [dismissed, setDismissed] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const urls = ONBOARDING_SLIDES.map((s) => s.img);
        imageCache.preload(urls);
    }, []);

    if (dismissed) return null;

    const slide = ONBOARDING_SLIDES[current];
    const isLast = current === ONBOARDING_SLIDES.length - 1;

    const slideTransition = shouldReduceMotion ? fadeFast : springSnappy;
    const slideVariants = shouldReduceMotion
        ? {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
          }
        : {
              initial: { opacity: 0, transform: "scale(0.98)" },
              animate: { opacity: 1, transform: "scale(1)" },
              exit: { opacity: 0, transform: "scale(0.98)" },
          };

    return (
        <div className="idea-onboarding-card max-w-md mx-auto">
            <div className="relative overflow-hidden">
                <AnimatePresence mode="sync" initial={false}>
                    <motion.div
                        key={current}
                        initial={slideVariants.initial}
                        animate={slideVariants.animate}
                        exit={slideVariants.exit}
                        transition={slideTransition}
                    >
                        <CachedSlideImage src={slide.img} alt={slide.title} />
                    </motion.div>
                </AnimatePresence>
                <button
                    onClick={() => setDismissed(true)}
                    className="idea-icon-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur hover:bg-white"
                    aria-label="关闭"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-6 text-center space-y-4">
                <AnimatePresence mode="sync" initial={false}>
                    <motion.div
                        key={`text-${current}`}
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(6px)" }}
                        animate={{ opacity: 1, transform: "translateY(0px)" }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(-4px)" }}
                        transition={slideTransition}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold text-black tracking-tight">{slide.title}</h3>
                        <p className="text-sm text-[var(--idea-text-secondary)] leading-relaxed">
                            {slide.desc}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-center gap-2" role="tablist" aria-label="轮播指示器">
                    {ONBOARDING_SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`idea-dot ${idx === current ? "active" : ""}`}
                            role="tab"
                            aria-selected={idx === current}
                            aria-label={`第 ${idx + 1} 页`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => {
                        if (isLast) setDismissed(true);
                        else setCurrent((c) => c + 1);
                    }}
                    className="idea-btn-primary w-full"
                >
                    {isLast ? "开始探索" : "下一步"}
                </button>
            </div>
        </div>
    );
}
