import { createClient } from 'redis';

// In-memory fallback storage when Redis is not available
const fallbackStorage = new Map<string, { value: string; expiresAt: number }>();

let redisClient: any = null;
let isRedisAvailable = false;

// Initialize Redis client only if REDIS_URL is provided
if (process.env.REDIS_URL) {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on('error', (err: any) => {
    console.error('Redis Client Error:', err);
    isRedisAvailable = false;
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
    isRedisAvailable = true;
  });

  // Connect to Redis
  if (!redisClient.isOpen) {
    redisClient.connect().catch((err: any) => {
      console.error('Failed to connect to Redis:', err);
      isRedisAvailable = false;
    });
  }
} else {
  console.log('REDIS_URL not provided, using in-memory storage');
}

// Helper functions for token management with fallback
export const tokenHelpers = {
  // Store refresh token with expiration
  async storeRefreshToken(userId: string, token: string, expiresIn: number): Promise<void> {
    try {
      if (isRedisAvailable && redisClient) {
        await redisClient.setEx(`refresh_token:${userId}`, expiresIn, token);
      } else {
        const expiresAt = Date.now() + (expiresIn * 1000);
        fallbackStorage.set(`refresh_token:${userId}`, { value: token, expiresAt });
      }
    } catch (error) {
      console.error('Error storing refresh token:', error);
      // Fallback to in-memory storage
      const expiresAt = Date.now() + (expiresIn * 1000);
      fallbackStorage.set(`refresh_token:${userId}`, { value: token, expiresAt });
    }
  },

  // Get refresh token for user
  async getRefreshToken(userId: string): Promise<string | null> {
    try {
      if (isRedisAvailable && redisClient) {
        return await redisClient.get(`refresh_token:${userId}`);
      } else {
        const stored = fallbackStorage.get(`refresh_token:${userId}`);
        if (stored && stored.expiresAt > Date.now()) {
          return stored.value;
        }
        // Clean up expired token
        fallbackStorage.delete(`refresh_token:${userId}`);
        return null;
      }
    } catch (error) {
      console.error('Error getting refresh token:', error);
      const stored = fallbackStorage.get(`refresh_token:${userId}`);
      if (stored && stored.expiresAt > Date.now()) {
        return stored.value;
      }
      fallbackStorage.delete(`refresh_token:${userId}`);
      return null;
    }
  },

  // Delete refresh token (logout)
  async deleteRefreshToken(userId: string): Promise<void> {
    try {
      if (isRedisAvailable && redisClient) {
        await redisClient.del(`refresh_token:${userId}`);
      } else {
        fallbackStorage.delete(`refresh_token:${userId}`);
      }
    } catch (error) {
      console.error('Error deleting refresh token:', error);
      fallbackStorage.delete(`refresh_token:${userId}`);
    }
  },

  // Blacklist access token
  async blacklistAccessToken(token: string, expiresIn: number): Promise<void> {
    try {
      if (isRedisAvailable && redisClient) {
        await redisClient.setEx(`blacklist:${token}`, expiresIn, 'true');
      } else {
        const expiresAt = Date.now() + (expiresIn * 1000);
        fallbackStorage.set(`blacklist:${token}`, { value: 'true', expiresAt });
      }
    } catch (error) {
      console.error('Error blacklisting access token:', error);
      const expiresAt = Date.now() + (expiresIn * 1000);
      fallbackStorage.set(`blacklist:${token}`, { value: 'true', expiresAt });
    }
  },

  // Check if access token is blacklisted
  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      if (isRedisAvailable && redisClient) {
        const result = await redisClient.get(`blacklist:${token}`);
        return result === 'true';
      } else {
        const stored = fallbackStorage.get(`blacklist:${token}`);
        if (stored && stored.expiresAt > Date.now()) {
          return stored.value === 'true';
        }
        // Clean up expired blacklist entry
        fallbackStorage.delete(`blacklist:${token}`);
        return false;
      }
    } catch (error) {
      console.error('Error checking token blacklist:', error);
      const stored = fallbackStorage.get(`blacklist:${token}`);
      if (stored && stored.expiresAt > Date.now()) {
        return stored.value === 'true';
      }
      fallbackStorage.delete(`blacklist:${token}`);
      return false;
    }
  },

  // Clean up expired tokens (can be run periodically)
  async cleanupExpiredTokens(): Promise<void> {
    try {
      if (isRedisAvailable && redisClient) {
        // Redis handles expiration automatically
        console.log('Redis cleanup completed');
      } else {
        // Clean up expired entries from in-memory storage
        const now = Date.now();
        for (const [key, value] of fallbackStorage.entries()) {
          if (value.expiresAt <= now) {
            fallbackStorage.delete(key);
          }
        }
        console.log('In-memory cleanup completed');
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
};

export default redisClient; 