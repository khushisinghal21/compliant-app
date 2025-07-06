import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateTokenPair } from '@/lib/jwt';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();
    console.log('Refresh request received, token length:', refreshToken?.length || 0);

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Verify refresh token
    console.log('Calling verifyRefreshToken...');
    const payload = await verifyRefreshToken(refreshToken);
    
    // Verify user still exists
    await dbConnect();
    const user = await User.findById(payload.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Generate new token pair
    const newTokenPair = await generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    });

    return NextResponse.json({
      message: 'Tokens refreshed successfully',
      accessToken: newTokenPair.accessToken,
      refreshToken: newTokenPair.refreshToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Invalid refresh token' },
      { status: 401 }
    );
  }
} 