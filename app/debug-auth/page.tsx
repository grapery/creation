"use client";

import { useEffect, useState } from "react";
import { getAuthToken, clearTokens } from "@/lib/api/client";
import { showSuccess, showInfo } from "@/lib/toast-utils";

export default function DebugAuthPage() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [checkResult, setCheckResult] = useState<string>("");

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Decode JWT (without verification, just for inspection)
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setTokenInfo({
            hasToken: true,
            tokenLength: token.length,
            payload: payload,
            expiresAt: new Date(payload.exp * 1000).toISOString(),
            isExpired: Date.now() > payload.exp * 1000
          });
        }
      } catch (e) {
        setTokenInfo({ hasToken: true, error: 'Failed to decode token' });
      }
    } else {
      setTokenInfo({ hasToken: false });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Auth Debug Info</h1>

        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Token Status</h2>
          <pre className="bg-secondary p-4 rounded overflow-auto">
            {JSON.stringify(tokenInfo, null, 2)}
          </pre>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              const token = getAuthToken();
              const result = token ? `Token exists (length: ${token.length})` : 'No token found';
              setCheckResult(result);
              showInfo(result);
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Check Token
          </button>

          <button
            onClick={() => {
              clearTokens();
              showSuccess('Tokens cleared!');
              setTimeout(() => window.location.reload(), 1000);
            }}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded"
          >
            Clear Tokens
          </button>

          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="px-4 py-2 bg-secondary rounded"
          >
            Go Home
          </button>
        </div>

        {checkResult && (
          <div className="border rounded-lg p-4 bg-secondary">
            <h2 className="text-lg font-semibold mb-2">Check Result</h2>
            <p className="text-sm">{checkResult}</p>
          </div>
        )}

        <div className="border rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold">Instructions</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Check if token exists in localStorage</li>
            <li>Check if token is expired (see payload.exp)</li>
            <li>If token is invalid/expired, click "Clear Tokens" and login again</li>
            <li>Check browser console for detailed API request logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
