import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: any;
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
    // Load Google Identity Services script
    if (scriptLoaded.current || !clientId) return;

    scriptLoaded.current = true;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoaded(true);
      console.log('[Google OAuth] Script loaded successfully');
    };
    script.onerror = () => {
      console.error('[Google OAuth] Failed to load script');
      onError?.();
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [clientId, onError]);

  const signIn = async () => {
    if (!isLoaded || !window.google) {
      console.error('[Google OAuth] Google script not loaded');
      return;
    }

    try {
      setIsLoading(true);
      console.log('[Google OAuth] Initializing sign-in...');

      // Use Google's ID token flow (recommended for server-side verification)
      // This returns an ID token that can be verified by the backend
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: (response: any) => {
          if (response.code) {
            console.log('[Google OAuth] Authorization code received (use backend to exchange for tokens)');
            // Note: Backend would need to exchange this code for tokens
            // For now, we'll use the implicit flow with ID token instead
            setIsLoading(false);
          } else if (response.error) {
            console.error('[Google OAuth] Error:', response.error);
            onError?.();
            setIsLoading(false);
          }
        },
        error_callback: (error: any) => {
          console.error('[Google OAuth] Authorization error:', error);
          onError?.();
          setIsLoading(false);
        },
      });

      // Alternative: Use ID token flow directly
      // This is simpler for web clients
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: GoogleCredentialResponse) => {
          console.log('[Google OAuth] ID token received');
          setIsLoading(false);
          onSuccess?.(response);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Prompt the user to sign in
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.error('[Google OAuth] Prompt not displayed');
          onError?.();
          setIsLoading(false);
        } else {
          // Successfully prompted
          console.log('[Google OAuth] Prompt displayed successfully');
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
