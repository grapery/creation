"use client";

import { useAuth } from "@/providers/auth-provider";
import { useLoginPrompt } from "@/components/auth/login-prompt";
import { Loader2 } from "lucide-react";

interface WithAuthCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * HOC to wrap components that require authentication
 * Shows login prompt if user is not authenticated
 * 
 * @example
 * ```tsx
 * <WithAuthCheck>
 *   <MyProtectedComponent />
 * </WithAuthCheck>
 * ```
 */
export function WithAuthCheck({ children, fallback }: WithAuthCheckProps) {
  const { user, loading } = useAuth();
  const { LoginPromptModal, show } = useLoginPrompt();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show fallback or login prompt if not authenticated
  if (!user) {
    // If custom fallback provided, use it
    if (fallback) {
      return (
        <>
          {fallback}
          <LoginPromptModal />
        </>
      );
    }

    // Otherwise show empty state with login prompt
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 mx-auto text-muted-foreground" />
          <div className="text-muted-foreground">
            Please sign in to access this content
          </div>
        </div>
        <LoginPromptModal />
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}
