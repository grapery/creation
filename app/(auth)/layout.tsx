"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ArrowDown, GitBranch, Users, BookOpen, Layers, MessageSquare, X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { githubImages } from "@/lib/github-assets";

// Image paths - can be configured to load from GitHub via GITHUB_ASSETS_BASE_URL env var
// See lib/github-assets.ts for configuration details
const images = {
  storyOverview: githubImages.storyOverview,
  storyboard: githubImages.storyboard,
  branching: githubImages.branching,
  roles: githubImages.roles,
  collaboration: githubImages.collaboration
};

// Chalk styled separator
const ChalkLine = () => (
  <div className="w-full h-1 bg-white/20 my-8 rounded-full relative overflow-hidden">
    <div className="absolute inset-0 bg-white/40 skew-x-12 w-1/2 animate-pulse" />
  </div>
);

// Feature Card with Image Component
const FeatureCard = ({ 
  title, 
  desc, 
  img, 
  icon: Icon,
  index 
}: { 
  title: string; 
  desc: string; 
  img: string; 
  icon: any; 
  index: number;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="mb-8 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full border-2" style={{ backgroundColor: 'oklch(0.85 0.15 85 / 20%)', borderColor: 'oklch(0.85 0.15 85 / 50%)' }}>
          <Icon className="w-5 h-5" style={{ color: 'oklch(0.85 0.15 85)' }} />
        </div>
        <h3 className="text-lg font-bold" style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}>{title}</h3>
      </div>
      
      {/* Image Container */}
      <div className="relative w-full overflow-hidden rounded-lg shadow-2xl border-2 border-white/10">
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          src={img} 
          alt={title}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>
      
      <p className="text-sm leading-relaxed" style={{ 
        color: 'oklch(0.95 0.02 95 / 80%)',
        fontFamily: '"Ma Shan Zheng", cursive'
      }}>
        {desc}
      </p>
    </motion.div>
  );
};

// Feature Carousel Component
const FeatureCarousel = () => {
  const features = [
    {
      index: 0,
      title: "故事全览", 
      desc: "直观的故事概览界面，像黑板报一样清晰展示故事的开端、发展与走向。无论是宏大史诗还是微小瞬间，都能一目了然。",
      img: images.storyOverview,
      icon: BookOpen
    },
    {
      index: 1,
      title: "故事板创作", 
      desc: "可视化的分镜故事板，帮助你梳理情节脉络。拖拽、排序、标注，让创作过程像搭积木一样简单有趣。",
      img: images.storyboard,
      icon: Layers
    },
    {
      index: 2,
      title: "分支剧情系统", 
      desc: "独创的树状分支结构，每一个选择都通向不同的平行宇宙。探索'如果...会怎样'的无限可能性。",
      img: images.branching,
      icon: GitBranch
    },
    {
      index: 3,
      title: "角色深度塑造", 
      desc: "AI 驱动的角色系统，赋予每个角色独特的性格、记忆和声音。他们不仅仅是棋子，更是与你共同创作的伙伴。",
      img: images.roles,
      icon: Users
    },
    {
      index: 4,
      title: "多人实时协作", 
      desc: "邀请好友共同创作，在同一棵故事树上开枝散叶。Fork 机制让好的创意被更多人看见和延续。",
      img: images.collaboration,
      icon: MessageSquare
    }
  ];

  const [currentFeature, setCurrentFeature] = useState(0);

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <div className="relative py-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFeature}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <FeatureCard {...features[currentFeature]} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={prevFeature}
          className="rounded-full border-white/20 hover:border-white/40 bg-white/5"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2">
          {features.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentFeature(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentFeature ? 'w-6' : 'bg-white/30 hover:bg-white/50'
              }`}
              style={{
                backgroundColor: idx === currentFeature ? 'oklch(0.85 0.15 85)' : undefined
              }}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={nextFeature}
          className="rounded-full border-white/20 hover:border-white/40 bg-white/5"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001
    });

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Feature Explainer */}
            <div className="relative hidden h-full flex-col overflow-y-auto lg:flex" style={{
                background: 'oklch(0.25 0.05 145)'
            }}>
                {/* Noise Texture Overlay */}
                <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`
                    }}
                />

                {/* Header */}
                <div className="relative z-20 flex items-center p-6 text-lg font-medium border-b border-white/10">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                        <span className="text-background font-bold">V</span>
                    </div>
                    <span style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}>未择 Voyager</span>
                </div>

                {/* Content - Scrollable Area */}
                <div className="relative z-20 flex-1 overflow-y-auto">
                    {/* Hero Section */}
                    <div className="p-8 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-block px-4 py-2 border-2 rounded-full font-display text-base"
                            style={{
                                borderColor: 'oklch(0.85 0.15 85 / 50%)',
                                color: 'oklch(0.85 0.15 85)',
                                fontFamily: '"ZCOOL KuaiLe", cursive'
                            }}
                        >
                            ✨ AI 驱动的分支故事创作平台
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-4xl font-bold leading-tight"
                            style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
                        >
                            你的故事<br/>
                            <span 
                                className="text-transparent bg-clip-text bg-gradient-to-r"
                                style={{
                                    backgroundImage: 'linear-gradient(to right, oklch(0.85 0.15 85), oklch(0.80 0.10 200))'
                                }}
                            >
                                无限可能
                            </span>
                        </motion.h1>

                        <motion.p 
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-lg leading-relaxed"
                            style={{ 
                                color: 'oklch(0.95 0.02 95)',
                                fontFamily: '"Ma Shan Zheng", cursive'
                            }}
                        >
                            探索独创的树状分支叙事结构，让每个节点都衍生出新的世界。用粉笔画出你的奇思妙想，与 AI 共同谱写传奇。
                        </motion.p>
                    </div>

                    <ChalkLine />

                    {/* Features Section with Carousel */}
                    <div className="px-8 pb-8">
                        <h2 
                            className="text-2xl font-bold mb-6 text-center"
                            style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
                        >
                            核心功能展示
                        </h2>
                        <p 
                            className="text-sm text-center mb-6"
                            style={{ 
                                color: 'oklch(0.95 0.02 95 / 70%)',
                                fontFamily: '"Ma Shan Zheng", cursive'
                            }}
                        >
                            全方位的创作工具，让想象力落地生根
                        </p>

                        <FeatureCarousel />
                    </div>

                    <ChalkLine />

                    {/* CTA Section */}
                    <div className="p-8 text-center relative overflow-hidden">
                        <div 
                            className="absolute inset-0 -skew-y-3 transform origin-bottom-left"
                            style={{ backgroundColor: 'oklch(0.85 0.15 85 / 5%)' }}
                        />
                        
                        <div className="relative z-10">
                            <h2 
                                className="text-3xl font-bold mb-4"
                                style={{ fontFamily: '"ZCOOL KuaiLe", cursive' }}
                            >
                                准备好开始了吗？
                            </h2>
                            <p 
                                className="text-lg mb-6"
                                style={{ 
                                    color: 'oklch(0.95 0.02 95 / 80%)',
                                    fontFamily: '"Ma Shan Zheng", cursive'
                                }}
                            >
                                加入未择 Voyager，在这个无限可能的黑板上，画出属于你的世界。
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button 
                                    size="lg" 
                                    className="text-lg px-8 py-4 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform"
                                    style={{ 
                                        backgroundColor: 'oklch(0.85 0.15 340)',
                                        color: 'oklch(0.25 0.05 145)'
                                    }}
                                >
                                    免费注册
                                </Button>
                                <Button 
                                    size="lg" 
                                    variant="outline" 
                                    className="text-lg px-8 py-4 rounded-full font-bold border-white/30 hover:bg-white/10"
                                >
                                    了解更多
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/10" style={{ backgroundColor: 'oklch(0.25 0.05 145)' }}>
                        <div className="flex flex-col gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center border" style={{ backgroundColor: 'oklch(0.95 0.02 95 / 10%)', borderColor: 'oklch(0.95 0.02 95 / 20%)' }}>
                                    <span className="text-white font-bold text-sm">V</span>
                                </div>
                                <span 
                                    className="text-lg"
                                    style={{ 
                                        color: 'oklch(0.95 0.02 95 / 70%)',
                                        fontFamily: '"ZCOOL KuaiLe", cursive'
                                    }}
                                >
                                    未择 Voyager
                                </span>
                            </div>
                            <div 
                                className="text-sm"
                                style={{ 
                                    color: 'oklch(0.95 0.02 95 / 60%)',
                                    fontFamily: '"Ma Shan Zheng", cursive'
                                }}
                            >
                                © 2026 RankQuantity. All rights reserved.
                            </div>
                            <div className="flex gap-6 text-sm">
                                <a href="#" className="hover:text-white transition-colors" style={{ color: 'oklch(0.95 0.02 95 / 60%)', fontFamily: '"Ma Shan Zheng", cursive' }}>隐私</a>
                                <a href="#" className="hover:text-white transition-colors" style={{ color: 'oklch(0.95 0.02 95 / 60%)', fontFamily: '"Ma Shan Zheng", cursive' }}>条款</a>
                                <a href="#" className="hover:text-white transition-colors" style={{ color: 'oklch(0.95 0.02 95 / 60%)', fontFamily: '"Ma Shan Zheng", cursive' }}>推特</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Progress Bar */}
                <motion.div
                    className="fixed left-0 top-0 w-full h-1 origin-left z-50 lg:w-1/2"
                    style={{ 
                        scaleX,
                        background: 'linear-gradient(to right, oklch(0.85 0.15 85), oklch(0.80 0.10 200), oklch(0.85 0.15 340))'
                    }}
                />

                {/* Decorative Background Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -right-[10%] w-[400px] h-[400px] border-2 border-dashed border-white/5 rounded-full" 
                    />
                    <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[40%] -left-[10%] w-[300px] h-[300px] border-2 border-dashed border-white/5 rounded-full" 
                    />
                </div>
            </div>

            {/* Right Side - Login/Register Form */}
            <div className="flex h-full items-center justify-center p-8 bg-background">
                {children}
            </div>
        </div>
    )
}
