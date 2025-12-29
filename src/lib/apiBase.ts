/**
 * API Base URL Configuration
 * Supports multiple backend services: server, chatmcp, vippay
 */

export function getApiBaseUrl(service: 'server' | 'chat' | 'vippay' = 'server'): string {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (import.meta.env.DEV) {
    // In development, use proxy for server and chat services
    if (service === 'server') {
      if (envBaseUrl && (envBaseUrl.includes('localhost:8080') || envBaseUrl.includes('127.0.0.1:8080'))) {
        return '/api';
      }
      return envBaseUrl || '/api';
    } else if (service === 'chat') {
      // Chat service uses chatmcp (default port 8080, same as server in dev)
      return '/api';
    } else if (service === 'vippay') {
      // VipPay service (default port 8081)
      const vippayUrl = import.meta.env.VITE_VIPPAY_API_BASE_URL || 'http://localhost:8081';
      return vippayUrl.includes('localhost') || vippayUrl.includes('127.0.0.1') 
        ? '/api/vippay' 
        : `${vippayUrl}/api/vippay`;
    }
  } else {
    // In production, use environment variables
    if (service === 'server') {
      if (envBaseUrl && !envBaseUrl.endsWith('/api')) {
        return `${envBaseUrl}/api`;
      }
      return envBaseUrl || '/api';
    } else if (service === 'chat') {
      const chatUrl = import.meta.env.VITE_CHAT_API_BASE_URL || envBaseUrl;
      if (chatUrl && !chatUrl.endsWith('/api')) {
        return `${chatUrl}/api`;
      }
      return chatUrl || '/api';
    } else if (service === 'vippay') {
      const vippayUrl = import.meta.env.VITE_VIPPAY_API_BASE_URL || envBaseUrl;
      if (vippayUrl && !vippayUrl.endsWith('/api/vippay')) {
        return `${vippayUrl}/api/vippay`;
      }
      return vippayUrl || '/api/vippay';
    }
  }

  return '/api';
}

