import jwt from 'jsonwebtoken';
import { tokenHelpers } from './redis';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-super-secret-refresh-key-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Generate access token (short-lived)
export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '5m', // Access token expires in 5 minutes (for testing)
  });
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d', // Refresh token expires in 7 days
  });
};

// Generate both access and refresh tokens
export const generateTokenPair = async (payload: JWTPayload): Promise<TokenPair> => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  // Store refresh token in Redis
  await tokenHelpers.storeRefreshToken(payload.userId, refreshToken, 7 * 24 * 60 * 60); // 7 days in seconds
  
  return { accessToken, refreshToken };
};

// Verify access token
export const verifyAccessToken = async (token: string): Promise<JWTPayload> => {
  try {
    // Check if token is blacklisted
    const isBlacklisted = await tokenHelpers.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new Error('Token has been revoked');
    }
    
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = async (token: string): Promise<JWTPayload> => {
  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as JWTPayload;
    
    // Check if refresh token exists in Redis
    const storedToken = await tokenHelpers.getRefreshToken(payload.userId);
    if (!storedToken || storedToken !== token) {
      throw new Error('Refresh token not found or invalid');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Revoke tokens (logout)
export const revokeTokens = async (userId: string, accessToken: string): Promise<void> => {
  try {
    // Decode access token to get expiration
    const decoded = jwt.decode(accessToken) as any;
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    
    // Blacklist access token
    if (expiresIn > 0) {
      await tokenHelpers.blacklistAccessToken(accessToken, expiresIn);
    }
    
    // Delete refresh token
    await tokenHelpers.deleteRefreshToken(userId);
  } catch (error) {
    console.error('Error revoking tokens:', error);
  }
};

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader: string | null): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}; 