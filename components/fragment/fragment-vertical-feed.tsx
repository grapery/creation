"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Share2,
  Repeat2,
  UserPlus,
} from "lucide-react";
import { fragments } from "@/lib/api/fragments";
import type { StoryFragment } from "@/lib/types";
import { useAuth } from "@/providers/auth-provider";
import { useLoginPrompt } from "@/components/auth/login-prompt";
import { loginUrlWithNext } from "@/lib/auth-redirect";

interface FragmentVerticalFeedProps {
  tab: "discover" | "following";
}

export function FragmentVerticalFeed({ tab }: FragmentVerticalFeedProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { show: showLoginPrompt, LoginPromptModal } = useLoginPrompt();

  const [items, setItems] = useState<StoryFragment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [, setCurrentIndex] = useState(0);
  const [likedAnimations, setLikedAnimations] = useState<
    Record<string, boolean>
  >({});

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<{ time: number; id: string }>({
    time: 0,
    id: "",
  });
  const LIMIT = 20;

  const loadFragments = useCallback(
    async (reset = false) => {
      setLoading(true);
      try {
        const currentOffset = reset ? 0 : offset;
        const res = await fragments.list({
          tab,
          limit: LIMIT,
          offset: currentOffset,
        });
        setItems((prev) =>
          reset ? res.fragments : [...prev, ...res.fragments]
        );
        setHasMore(res.fragments.length >= LIMIT);
        setOffset(currentOffset + LIMIT);
      } catch (err) {
        console.error("Failed to load fragments:", err);
      } finally {
        setLoading(false);
      }
    },
    [tab, offset]
  );

  useEffect(() => {
    setOffset(0);
    setCurrentIndex(0);
    loadFragments(true);
  }, [tab]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const index = Math.round(el.scrollTop / el.clientHeight);
    setCurrentIndex(index);

    // Load more when near bottom
    if (index >= items.length - 3 && hasMore && !loading) {
      loadFragments();
    }
  }, [items.length, hasMore, loading, loadFragments]);

  const handleDoubleTap = useCallback(
    (fragment: StoryFragment) => {
      const now = Date.now();
      const last = lastTapRef.current;
      if (last.id === fragment.id && now - last.time < 300) {
        // Double tap detected
        if (!user) {
          showLoginPrompt();
          return;
        }
        const newLiked = !fragment.isLiked;
        setItems((prev) =>
          prev.map((f) =>
            f.id === fragment.id
              ? {
                  ...f,
                  isLiked: newLiked,
                  likes: (f.likes || 0) + (newLiked ? 1 : -1),
                }
              : f
          )
        );
        if (newLiked) {
          setLikedAnimations((prev) => ({ ...prev, [fragment.id]: true }));
          setTimeout(() => {
            setLikedAnimations((prev) => ({
              ...prev,
              [fragment.id]: false,
            }));
          }, 800);
          fragments.like(fragment.id).catch(() => {});
        } else {
          fragments.unlike(fragment.id).catch(() => {});
        }
        lastTapRef.current = { time: 0, id: "" };
      } else {
        lastTapRef.current = { time: now, id: fragment.id };
      }
    },
    [user, showLoginPrompt]
  );

  const handleLike = useCallback(
    (fragment: StoryFragment, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        showLoginPrompt();
        return;
      }
      const newLiked = !fragment.isLiked;
      setItems((prev) =>
        prev.map((f) =>
          f.id === fragment.id
            ? {
                ...f,
                isLiked: newLiked,
                likes: (f.likes || 0) + (newLiked ? 1 : -1),
              }
            : f
        )
      );
      if (newLiked) {
        setLikedAnimations((prev) => ({ ...prev, [fragment.id]: true }));
        setTimeout(() => {
          setLikedAnimations((prev) => ({ ...prev, [fragment.id]: false }));
        }, 800);
        fragments.like(fragment.id).catch(() => {});
      } else {
        fragments.unlike(fragment.id).catch(() => {});
      }
    },
    [user, showLoginPrompt]
  );

  const handleShare = useCallback(
    async (fragment: StoryFragment, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await fragments.share(fragment.id);
      } catch { /* analytics only */ }
      try {
        const { shareContent } = await import("@/lib/api/share");
        await shareContent({
          kind: "fragment",
          id: fragment.id,
          title: fragment.content?.slice(0, 50) || "Fragment",
        });
      } catch { /* ignore abort */ }
    },
    []
  );

  const handleConvert = useCallback(
    (fragment: StoryFragment, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        router.push(loginUrlWithNext(`/create?fragmentId=${fragment.id}`));
        return;
      }
      router.push(`/create?fragmentId=${fragment.id}`);
    },
    [user, router]
  );

  if (loading && items.length === 0) {
    return (
      <div className="h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-[calc(100vh-180px)] flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg font-semibold mb-2">No fragments yet</p>
        <p className="text-sm text-muted-foreground">
          {tab === "discover"
            ? "Be the first to create a fragment!"
            : "Follow creators to see their fragments here"}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[calc(100vh-180px)] overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {items.map((fragment) => (
        <div
          key={fragment.id}
          className="h-full snap-start relative flex items-center justify-center"
          style={{ height: "calc(100vh - 180px)" }}
          onClick={() => handleDoubleTap(fragment)}
        >
          {/* Full-screen card */}
          <div className="relative w-full h-full max-w-lg mx-auto overflow-hidden bg-black">
            {/* Image */}
            {fragment.imageUrls && fragment.imageUrls.length > 0 ? (
              <img
                src={fragment.imageUrls[0]}
                alt={fragment.caption || fragment.content.slice(0, 50)}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center p-8">
                <p className="text-white/90 text-center text-lg leading-relaxed">
                  {fragment.content.slice(0, 200)}
                </p>
              </div>
            )}

            {/* Double-tap heart animation */}
            {likedAnimations[fragment.id] && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <Heart className="w-24 h-24 text-white fill-red-500 drop-shadow-lg animate-bounce" />
              </div>
            )}

            {/* Bottom gradient overlay for text */}
            <div className="absolute bottom-0 left-0 right-14 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 pb-6 px-4">
              {/* Author */}
              <div className="flex items-center gap-2 mb-2">
                {fragment.creatorAvatar && (
                  <img
                    src={fragment.creatorAvatar}
                    alt=""
                    className="w-8 h-8 rounded-full border border-white/30"
                  />
                )}
                <span className="text-white text-sm font-semibold">
                  {fragment.creatorName || "Unknown"}
                </span>
              </div>

              {/* Content */}
              <p className="text-white text-sm leading-snug line-clamp-3">
                {fragment.caption || fragment.content}
              </p>

              {/* Topic badge */}
              {fragment.topic && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-white/20 rounded-full text-white text-xs">
                  #{fragment.topic}
                </span>
              )}
            </div>

            {/* Right-side action rail */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-10">
              {/* Avatar + Follow */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {fragment.creatorAvatar ? (
                    <img
                      src={fragment.creatorAvatar}
                      alt=""
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted border-2 border-white flex items-center justify-center text-white text-xs">
                      {(fragment.creatorName || "U")[0].toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        showLoginPrompt();
                        return;
                      }
                    }}
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                  >
                    <UserPlus className="w-3 h-3 text-primary-foreground" />
                  </button>
                </div>
              </div>

              {/* Like */}
              <button
                onClick={(e) => handleLike(fragment, e)}
                className="flex flex-col items-center gap-1"
              >
                <Heart
                  className={`w-7 h-7 transition-transform ${
                    fragment.isLiked
                      ? "text-red-500 fill-red-500 scale-110"
                      : "text-white"
                  }`}
                />
                <span className="text-white text-xs">
                  {fragment.likes || 0}
                </span>
              </button>

              {/* Comment */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/fragments/${fragment.id}`);
                }}
                className="flex flex-col items-center gap-1"
              >
                <MessageCircle className="w-7 h-7 text-white" />
                <span className="text-white text-xs">
                  {fragment.comments || 0}
                </span>
              </button>

              {/* Convert to story */}
              {!fragment.isConverted && (
                <button
                  onClick={(e) => handleConvert(fragment, e)}
                  className="flex flex-col items-center gap-1"
                >
                  <Repeat2 className="w-7 h-7 text-white" />
                  <span className="text-white text-xs text-center">
                    Story
                  </span>
                </button>
              )}

              {/* Share */}
              <button
                onClick={(e) => handleShare(fragment, e)}
                className="flex flex-col items-center gap-1"
              >
                <Share2 className="w-7 h-7 text-white" />
                <span className="text-white text-xs">
                  {fragment.shares || 0}
                </span>
              </button>
            </div>
          </div>
        </div>
      ))}
      <LoginPromptModal />
    </div>
  );
}
