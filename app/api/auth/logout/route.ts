import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Clear any session/auth tokens if stored
    const response = NextResponse.json(
      { message: 'سەرکەوتووبوو' },
      { status: 200 }
    );

    // Clear auth cookies
    response.cookies.delete('sessionId');
    response.cookies.delete('auth_token');
    response.cookies.delete('user_id');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'هەڵەیەک ڕویدا' },
      { status: 500 }
    );
  }
}
