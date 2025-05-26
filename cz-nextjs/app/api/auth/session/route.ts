import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';

export async function GET() {
    try {
        const session = await getAuthSession();

        // Return the session data, which will include user information if logged in
        return NextResponse.json(session);
    } catch (error) {
        console.error('Error fetching session:', error);
        return NextResponse.json(
            { message: 'Failed to fetch session data' },
            { status: 500 }
        );
    }
}