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
    // Check if clientId is provided
    if (!clientId) {
      console.error('[Google OAuth] Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.');
      return;
    }

    // Check if script is already loaded
    if (scriptLoaded.current) {
      // Check if window.google is available
      if (window.google && window.google.accounts) {
        setIsLoaded(true);
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
          console.log('[Google OAuth] Script loaded successfully');
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
