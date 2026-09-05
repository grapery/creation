"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

type ImageWithFallbackProps = Omit<ImageProps, "onError"> & {
    /** 图片加载失败时兜底卡片里展示的文字（通常是标题） */
    fallbackText?: string;
};

/**
 * 带优雅降级的图片：加载失败时渲染深色渐变底 + 居中文字，
 * 替代浏览器默认的裂图图标（后端 OSS 数据异常期间的主要兜底路径）。
 */
export function ImageWithFallback({ fallbackText, alt, className, src, ...imageProps }: ImageWithFallbackProps) {
    const [failed, setFailed] = useState(!src);

    if (failed) {
        return (
            <div
                className={`flex items-center justify-center bg-gradient-to-br from-[#2b2b35] via-[#232330] to-[#1a1a24] p-4 text-center ${className ?? ""}`}
                role="img"
                aria-label={alt}
            >
                <span className="line-clamp-3 text-xs font-medium leading-relaxed text-white/70">
                    {fallbackText || alt || ""}
                </span>
            </div>
        );
    }

    return (
        <Image
            {...imageProps}
            src={src}
            alt={alt}
            className={className}
            onError={() => setFailed(true)}
        />
    );
}
