import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, extractTokenFromHeader } from './jwt';
import dbConnect from './mongodb';
import User from '@/models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// Middleware to authenticate user
export const authenticateUser = async (request: NextRequest): Promise<NextResponse | null> => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    const decoded = await verifyAccessToken(token);
    
    // Verify user still exists in database
    await dbConnect();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Add user info to request
    (request as AuthenticatedRequest).user = decoded;
    return null; // Continue to next middleware/route handler
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired access token' },
      { status: 401 }
    );
  }
};

// Middleware to require admin role
export const requireAdmin = async (request: NextRequest): Promise<NextResponse | null> => {
  const authResult = await authenticateUser(request);
  if (authResult) return authResult;

  const user = (request as AuthenticatedRequest).user;
  if (user?.role !== 'admin') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }

  return null;
};

// Middleware to require user role (user or admin)
export const requireAuth = async (request: NextRequest): Promise<NextResponse | null> => {
  return await authenticateUser(request);
}; 