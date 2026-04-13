"use client";

import { useState, useEffect, useCallback } from "react";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useTranslation } from "@/providers/language-provider";
import { DialogManager, DialogType, DialogPriority, hideDialog } from "@/lib/dialog-manager";

// 弹窗ID常量
const LOGIN_PROMPT_ID = "login_prompt";

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function LoginPrompt({
  isOpen,
  onClose,
  title,
  description,
}: LoginPromptProps) {
  const { t } = useTranslation();

  // 注册到DialogManager
  useEffect(() => {
    if (isOpen) {
      DialogManager.show(
        LOGIN_PROMPT_ID,
        DialogType.LOGIN_PROMPT,
        DialogPriority.CRITICAL
      );
    } else {
      DialogManager.hide(LOGIN_PROMPT_ID);
    }

    return () => {
      if (isOpen) {
        DialogManager.hide(LOGIN_PROMPT_ID);
      }
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    hideDialog(LOGIN_PROMPT_ID);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md p-8 relative">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon */}
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">
              {title || t("auth.join_community") || "Join Community"}
            </h3>
            <p className="text-muted-foreground">
              {description ||
                t("auth.login_prompt_description") ||
                "Sign in to access exclusive content, create your own stories, and connect with other creators."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              asChild
              className="flex-1"
              onClick={handleClose}
            >
              <Link href="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                {t("auth.login") || "Login"}
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="flex-1"
              onClick={handleClose}
            >
              <Link href="/register" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                {t("auth.sign_up") || "Sign Up"}
              </Link>
            </Button>
          </div>

          {/* Cancel Button */}
          <Button
            variant="ghost"
            className="w-full"
            onClick={handleClose}
          >
            {t("auth.maybe_later") || "Maybe Later"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

/**
 * Custom hook to handle login prompt state
 * Use this in components that need authentication
 *
 * @example
 * ```tsx
 * const { LoginPromptModal, show: showLoginPrompt } = useLoginPrompt();
 *
 * // Show the prompt
 * showLoginPrompt();
 *
 * // In your JSX
 * return (
 *   <div>
 *     <LoginPromptModal title="Custom Title" />
 *   </div>
 * );
 * ```
 */
export function useLoginPrompt() {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const show = useCallback(() => {
    // 检查是否已有其他高优先级弹窗显示
    if (!DialogManager.hasAnyDialogShowing()) {
      setShowLoginPrompt(true);
    } else {
      // 加入队列，稍后显示
      DialogManager.show(
        LOGIN_PROMPT_ID,
        DialogType.LOGIN_PROMPT,
        DialogPriority.CRITICAL,
        {
          onShow: () => setShowLoginPrompt(true),
          onHide: () => setShowLoginPrompt(false),
        }
      );
    }
  }, []);

  const hide = useCallback(() => {
    setShowLoginPrompt(false);
    hideDialog(LOGIN_PROMPT_ID);
  }, []);

  const LoginPromptModal = (props: Omit<LoginPromptProps, "isOpen" | "onClose">) => (
    <LoginPrompt
      isOpen={showLoginPrompt}
      onClose={hide}
      {...props}
    />
  );

  // 监听全局认证事件
  useEffect(() => {
    const handleShowLogin = () => {
      show();
    };

    window.addEventListener("auth:showLogin", handleShowLogin as EventListener);
    return () => {
      window.removeEventListener("auth:showLogin", handleShowLogin as EventListener);
    };
  }, [show]);

  return {
    show,
    hide,
    LoginPromptModal,
    isOpen: showLoginPrompt,
  };
}
