"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useLoginPrompt } from "@/components/auth/login-prompt";

/**
 * Custom hook for handling authentication requirements in pages and components
 * 
 * @returns Object containing auth state and control methods
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { requiresAuth } = useAuthRequired();
 *   
 *   const handleAction = () => {
 *     requiresAuth(() => {
 *       // This only runs if user is authenticated
 *       performProtectedAction();
 *     });
 *   };
 *   
 *   return <button onClick={handleAction}>Protected Action</button>;
 * }
 * ```
 */
export function useAuthRequired() {
  const { user, loading } = useAuth();
  const { LoginPromptModal, show: showLoginPrompt } = useLoginPrompt();
  const [customPromptTitle, setCustomPromptTitle] = useState<string>();
  const [customPromptDesc, setCustomPromptDesc] = useState<string>();

  /**
   * Execute a callback only if user is authenticated
   * Shows login prompt otherwise
   */
  const requiresAuth = useCallback((callback: () => void | Promise<void>, options?: {
    title?: string;
    description?: string;
  }) => {
    if (loading) return;

    if (!user) {
      // Set custom title/description if provided
      if (options?.title) setCustomPromptTitle(options.title);
      if (options?.description) setCustomPromptDesc(options.description);
      
      // Show login prompt
      showLoginPrompt();
      return;
    }

    // User is authenticated, execute callback
    callback();
  }, [user, loading, showLoginPrompt]);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !loading && !!user;

  /**
   * Check if auth check is still loading
   */
  const isCheckingAuth = loading;

  /**
   * Show login prompt with optional custom message
   */
  const showPrompt = useCallback((options?: {
    title?: string;
    description?: string;
  }) => {
    if (options?.title) setCustomPromptTitle(options.title);
    if (options?.description) setCustomPromptDesc(options.description);
    showLoginPrompt();
  }, [showLoginPrompt]);

  return {
    // Auth state
    isAuthenticated,
    isCheckingAuth,
    user,

    // Login Prompt Component
    LoginPromptModal,
    showPrompt,

    // Helper methods
    requiresAuth,

    // Custom prompt options (pass to LoginPrompt)
    customPromptTitle,
    customPromptDesc,
  };
}
