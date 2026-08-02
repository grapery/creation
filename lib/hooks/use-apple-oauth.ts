import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          state?: string;
          nonce?: string;
          usePopup?: boolean;
        }) => void;
        signIn: () => Promise<{
          authorization: {
            id_token: string;
            code?: string;
            state?: string;
          };
          user?: {
            email?: string;
            name?: {
              firstName?: string;
              lastName?: string;
            };
          };
        }>;
      };
    };
  }
}

function randomNonce(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

export interface AppleSignInResult {
  identityToken: string;
  authorizationCode?: string;
  user?: string;
  nonce?: string;
  givenName?: string;
  familyName?: string;
}

interface UseAppleOAuthOptions {
  clientId?: string;
  redirectURI?: string;
  onSuccess?: (result: AppleSignInResult) => void;
  onError?: (message?: string) => void;
}

export function useAppleOAuth({
  clientId,
  redirectURI,
  onSuccess,
  onError,
}: UseAppleOAuthOptions = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scriptLoaded = useRef(false);
  const nonceRef = useRef<string>('');

  const resolvedRedirect =
    redirectURI ||
    (typeof window !== 'undefined' ? `${window.location.origin}/login` : '');

  useEffect(() => {
    if (!clientId) return;
    if (scriptLoaded.current) {
      if (window.AppleID?.auth) setIsLoaded(true);
      return;
    }

    const existing = document.querySelector(
      'script[src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"]'
    );
    if (existing) {
      scriptLoaded.current = true;
      const check = setInterval(() => {
        if (window.AppleID?.auth) {
          setIsLoaded(true);
          clearInterval(check);
        }
      }, 100);
      setTimeout(() => clearInterval(check), 5000);
      return;
    }

    scriptLoaded.current = true;
    const script = document.createElement('script');
    script.src =
      'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    script.onerror = () => {
      scriptLoaded.current = false;
      onError?.('Failed to load Apple Sign In');
    };
    document.body.appendChild(script);
  }, [clientId, onError]);

  const signIn = useCallback(async () => {
    if (!clientId) {
      onError?.('Apple Sign In is not configured');
      return;
    }
    if (!isLoaded || !window.AppleID?.auth) {
      onError?.('Apple Sign In is still loading');
      return;
    }

    try {
      setIsLoading(true);
      const nonce = randomNonce();
      nonceRef.current = nonce;

      window.AppleID.auth.init({
        clientId,
        scope: 'name email',
        redirectURI: resolvedRedirect,
        nonce,
        usePopup: true,
      });

      const response = await window.AppleID.auth.signIn();
      const identityToken = response.authorization?.id_token;
      if (!identityToken) {
        onError?.('Apple Sign In did not return an identity token');
        return;
      }

      onSuccess?.({
        identityToken,
        authorizationCode: response.authorization?.code,
        nonce,
        givenName: response.user?.name?.firstName,
        familyName: response.user?.name?.lastName,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Apple Sign In failed';
      // User cancellation often has error code
      if (String(message).includes('popup_closed') || String(e).includes('1001')) {
        setIsLoading(false);
        return;
      }
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  }, [clientId, isLoaded, onError, onSuccess, resolvedRedirect]);

  return {
    isLoaded,
    isLoading,
    isConfigured: Boolean(clientId),
    signIn,
  };
}
