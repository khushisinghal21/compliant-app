import { NextRequest, NextResponse } from 'next/server';
import { revokeTokens, extractTokenFromHeader } from '@/lib/jwt';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const accessToken = extractTokenFromHeader(authHeader);

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 400 }
      );
    }

    // Decode token to get userId (without verification since we're logging out)
    const decoded = jwt.decode(accessToken);
    
    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      );
    }

    // Revoke tokens
    await revokeTokens((decoded as any).userId, accessToken);

    return NextResponse.json({
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
} 