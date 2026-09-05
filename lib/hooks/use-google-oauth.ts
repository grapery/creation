import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string; error?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme?: string; size?: string; text?: string; shape?: string }
          ) => void;
          prompt: (listener?: (notification: { isNotDisplayed?: () => boolean; isSkippedMoment?: () => boolean }) => void) => void;
        };
        oauth2: {
          initCodeClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { code?: string; error?: string }) => void;
            error_callback?: (error: { type?: string; message?: string }) => void;
          }) => { requestCode: () => void };
        };
      };
    };
  }
}

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface UseGoogleOAuthOptions {
  clientId?: string;
  onSuccess?: (credentialResponse: GoogleCredentialResponse) => void;
  onError?: () => void;
}

export function useGoogleOAuth({
  clientId,
  onSuccess,
  onError,
}: UseGoogleOAuthOptions = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Check if clientId is provided
    if (!clientId) {
      console.error('[Google OAuth] Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.');
      return;
    }

    // Check if script is already loaded
    if (scriptLoaded.current) {
      // Check if window.google is available
      if (window.google && window.google.accounts) {
        queueMicrotask(() => setIsLoaded(true));
      }
      return;
    }

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      scriptLoaded.current = true;
      // Wait a bit for the script to initialize
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.accounts) {
          setIsLoaded(true);
          clearInterval(checkGoogle);
        }
      }, 100);
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkGoogle);
        if (!window.google || !window.google.accounts) {
          console.error('[Google OAuth] Script exists but Google API not available');
        }
      }, 5000);
      return;
    }

    scriptLoaded.current = true;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Wait for Google API to be available
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.accounts) {
          setIsLoaded(true);
          clearInterval(checkGoogle);
        }
      }, 100);
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkGoogle);
        if (!window.google || !window.google.accounts) {
          console.error('[Google OAuth] Script loaded but Google API not available');
          onError?.();
        }
      }, 5000);
    };
    script.onerror = () => {
      console.error('[Google OAuth] Failed to load script');
      scriptLoaded.current = false;
      onError?.();
    };
    document.body.appendChild(script);

    return () => {
      // Don't remove script on cleanup as it might be used by other components
    };
  }, [clientId, onError]);

  const signIn = async () => {
    if (!clientId) {
      console.error('[Google OAuth] Client ID is not configured');
      onError?.();
      return;
    }

    if (!isLoaded || !window.google || !window.google.accounts) {
      console.error('[Google OAuth] Google script not loaded. isLoaded:', isLoaded, 'window.google:', !!window.google);
      onError?.();
      return;
    }

    try {
      setIsLoading(true);
      // Use Google's ID token flow (recommended for server-side verification)
      // This returns an ID token that can be verified by the backend
void window.google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: (response: { code?: string; error?: string }) => {
          if (response.code) {
            // Note: Backend would need to exchange this code for tokens
            // For now, we'll use the implicit flow with ID token instead
            setIsLoading(false);
          } else if (response.error) {
            console.error('[Google OAuth] Error:', response.error);
            onError?.();
            setIsLoading(false);
          }
        },
        error_callback: (error: { type?: string; message?: string }) => {
          console.error('[Google OAuth] Authorization error:', error);
          onError?.();
          setIsLoading(false);
        },
      });

      // Alternative: Use ID token flow directly
      // This is simpler for web clients
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          setIsLoading(false);
          onSuccess?.(response as GoogleCredentialResponse);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Prompt the user to sign in
      window.google.accounts.id.prompt((notification: { isNotDisplayed?: () => boolean; isSkippedMoment?: () => boolean } | undefined) => {
        if (notification?.isNotDisplayed?.()) {
          console.error('[Google OAuth] Prompt not displayed');
          onError?.();
          setIsLoading(false);
        } else {
          // Successfully prompted
        }
      });
    } catch (error) {
      console.error('[Google OAuth] Sign-in error:', error);
      onError?.();
      setIsLoading(false);
    }
  };

  return {
    isLoaded,
    isLoading,
    signIn,
  };
}
