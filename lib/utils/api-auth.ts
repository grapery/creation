"use client";

/**
 * Result type for authenticated API calls
 */
type AuthResult<T> = {
  data: T | null;
  error: Error | null;
  requiresAuth: boolean;
};

/**
 * Higher-order function to handle API calls that require authentication
 * Automatically shows login prompt on 401 errors
 * 
 * @param apiCall - The API function to call
 * @param onShowLogin - Callback to show login prompt
 * @returns Promise with data, error, and requiresAuth flag
 */
export async function withAuth<T>(
  apiCall: () => Promise<T>,
  onShowLogin?: () => void
): Promise<AuthResult<T>> {
  try {
    const data = await apiCall();
    return {
      data,
      error: null,
      requiresAuth: false,
    };
  } catch (error: any) {
    // Check if it's a 401 authentication error
    const isAuthError =
      error?.code === 401 ||
      error?.status === 401 ||
      error?.message?.includes("401") ||
      error?.message?.includes("Unauthorized") ||
      error?.message?.includes("token") ||
      error?.message?.includes("authentication");

    if (isAuthError && onShowLogin) {
      onShowLogin();
    }

    return {
      data: null,
      error: error as Error,
      requiresAuth: isAuthError,
    };
  }
}

/**
 * Check if an error is an authentication error
 */
export function isAuthError(error: any): boolean {
  return (
    error?.code === 401 ||
    error?.status === 401 ||
    error?.message?.includes("401") ||
    error?.message?.includes("Unauthorized") ||
    error?.message?.includes("token") ||
    error?.message?.includes("authentication")
  );
}
