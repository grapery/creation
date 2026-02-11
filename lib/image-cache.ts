/**
 * Image Cache using IndexedDB
 * 
 * Caches images locally for faster subsequent loads
 * and offline availability.
 */

import React from 'react';

const DB_NAME = 'voyager-image-cache';
const DB_VERSION = 1;
const STORE_NAME = 'images';

interface CachedImage {
  url: string;
  blob: Blob;
  timestamp: number;
  size: number;
}

class ImageCache {
  private db: IDBDatabase | null = null;
  private maxCacheSize = 50 * 1024 * 1024; // 50MB max
  private maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

  async init(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async get(url: string): Promise<string | null> {
    if (!this.db) await this.init();
    if (!this.db) return null;

    try {
      const transaction = this.db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      const result: CachedImage = await new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (!result) return null;

      // Check if expired
      if (Date.now() - result.timestamp > this.maxAge) {
        await this.delete(url);
        return null;
      }

      // Create object URL from cached blob
      return URL.createObjectURL(result.blob);
    } catch (error) {
      console.error('[ImageCache] Get error:', error);
      return null;
    }
  }

  async set(url: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;

    try {
      // Check cache size and cleanup if needed
      await this.cleanupIfNeeded();

      const data: CachedImage = {
        url,
        blob,
        timestamp: Date.now(),
        size: blob.size,
      };

      const transaction = this.db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await new Promise((resolve, reject) => {
        const request = store.put(data);
        request.onsuccess = () => resolve(void 0);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('[ImageCache] Set error:', error);
    }
  }

  async delete(url: string): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await new Promise((resolve, reject) => {
      const request = store.delete(url);
      request.onsuccess = () => resolve(void 0);
      request.onerror = () => reject(request.error);
    });
  }

  private async cleanupIfNeeded(): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    const allImages: CachedImage[] = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    const totalSize = allImages.reduce((sum, img) => sum + img.size, 0);

    if (totalSize > this.maxCacheSize) {
      // Sort by timestamp (oldest first) and remove oldest 20%
      const sorted = allImages.sort((a, b) => a.timestamp - b.timestamp);
      const toDelete = sorted.slice(0, Math.ceil(sorted.length * 0.2));

      for (const img of toDelete) {
        await this.delete(img.url);
      }
    }
  }

  // Preload and cache multiple images
  async preload(urls: string[]): Promise<void> {
    for (const url of urls) {
      // Check if already cached
      const cached = await this.get(url);
      if (cached) {
        URL.revokeObjectURL(cached); // Revoke the temp URL, we don't need it
        continue;
      }

      // Fetch and cache
      try {
        const response = await fetch(url, { 
          credentials: 'omit',
          cache: 'force-cache' // Use browser cache if available
        });
        if (response.ok) {
          const blob = await response.blob();
          await this.set(url, blob);
        }
      } catch (error) {
        console.error(`[ImageCache] Failed to preload ${url}:`, error);
      }
    }
  }
}

// Singleton instance
export const imageCache = new ImageCache();

// Hook for using cached images
export function useCachedImage(url: string | null): {
  src: string | null;
  isLoading: boolean;
  error: boolean;
} {
  const [src, setSrc] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!url) {
      setSrc(null);
      setIsLoading(false);
      setError(false);
      return;
    }

    let objectUrl: string | null = null;
    let isMounted = true;

    const loadImage = async () => {
      setIsLoading(true);
      setError(false);

      try {
        // Try to get from IndexedDB cache
        const cached = await imageCache.get(url);
        
        if (cached && isMounted) {
          setSrc(cached);
          setIsLoading(false);
          return;
        }

        // If not cached, fetch and cache
        const response = await fetch(url, { credentials: 'omit' });
        if (!response.ok) throw new Error('Failed to fetch');

        const blob = await response.blob();
        await imageCache.set(url, blob);

        if (isMounted) {
          objectUrl = URL.createObjectURL(blob);
          setSrc(objectUrl);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[useCachedImage] Error:', err);
        if (isMounted) {
          // Fallback to direct URL
          setSrc(url);
          setError(true);
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  return { src, isLoading, error };
}

// Preload images on app initialization
export async function preloadAuthImages(): Promise<void> {
  const { githubImages } = await import('./github-assets');
  
  const urls = [
    githubImages.storyOverview,
    githubImages.storyboard,
    githubImages.branching,
    githubImages.roles,
    githubImages.collaboration,
  ];

  await imageCache.preload(urls);
}
