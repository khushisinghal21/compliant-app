import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect to Redis
if (!redisClient.isOpen) {
  redisClient.connect().catch(console.error);
}

export default redisClient;

// Helper functions for token management
export const tokenHelpers = {
  // Store refresh token with expiration
  async storeRefreshToken(userId: string, token: string, expiresIn: number): Promise<void> {
    await redisClient.setEx(`refresh_token:${userId}`, expiresIn, token);
  },

  // Get refresh token for user
  async getRefreshToken(userId: string): Promise<string | null> {
    return await redisClient.get(`refresh_token:${userId}`);
  },

  // Delete refresh token (logout)
  async deleteRefreshToken(userId: string): Promise<void> {
    await redisClient.del(`refresh_token:${userId}`);
  },

  // Blacklist access token
  async blacklistAccessToken(token: string, expiresIn: number): Promise<void> {
    await redisClient.setEx(`blacklist:${token}`, expiresIn, 'true');
  },

  // Check if access token is blacklisted
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await redisClient.get(`blacklist:${token}`);
    return result === 'true';
  },

  // Clean up expired tokens (can be run periodically)
  async cleanupExpiredTokens(): Promise<void> {
    // This would require more complex Redis operations
    // For now, we rely on Redis TTL to handle expiration
    console.log('Token cleanup completed');
  }
}; 