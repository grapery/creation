"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useLoginPrompt } from "@/components/auth/login-prompt";
import { Loader2 } from "lucide-react";

interface AuthProtectedLayoutProps {
  children: React.ReactNode;
}

/**
 * Wrapper for pages that require authentication.
 * Shows login prompt if user is not authenticated.
 */
export default function AuthProtectedLayout({ children }: AuthProtectedLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { LoginPromptModal, show: showLoginPrompt } = useLoginPrompt();

  useEffect(() => {
    // Only check auth after loading is complete
    if (!loading && !user) {
      // Don't redirect, just show login prompt
      // The prompt will handle navigation
    }
  }, [user, loading, pathname]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, show login prompt and don't render children
  if (!user) {
    return (
      <div className="min-h-screen">
        {/* Placeholder content - login prompt will overlay */}
        <div className="p-4 text-center text-muted-foreground">
          Please sign in to access this page.
        </div>
        <LoginPromptModal />
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
