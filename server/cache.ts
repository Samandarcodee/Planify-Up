import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

const cacheManager = new CacheManager();

// Cleanup expired entries every 10 minutes
setInterval(() => cacheManager.cleanup(), 10 * 60 * 1000);

// Cache middleware
export const cacheMiddleware = (ttl: number = 5 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = `${req.method}:${req.originalUrl}`;
    const cachedData = cacheManager.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      cacheManager.set(cacheKey, data, ttl);
      return originalJson.call(this, data);
    };

    next();
  };
};

// Cache invalidation middleware
export const invalidateCache = (pattern: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Invalidate cache after successful operations
    const originalJson = res.json;
    res.json = function(data: any) {
      // Invalidate related cache entries
      for (const [key] of cacheManager['cache'].entries()) {
        if (key.includes(pattern)) {
          cacheManager.delete(key);
        }
      }
      return originalJson.call(this, data);
    };
    next();
  };
};

export { cacheManager };
