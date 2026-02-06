import { NextRequest, NextResponse } from 'next/server';

const getBackendUrl = () => {
    const nextUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const backUrl = process.env.BACKEND_URL;
    let base = nextUrl || backUrl || 'http://localhost:5001';
    if (base.endsWith('/')) base = base.slice(0, -1);
    return base;
};

const BACKEND_URL = getBackendUrl();

const getApiPath = (path: string) => {
    const hasApiSuffix = BACKEND_URL.endsWith('/api');
    if (hasApiSuffix && path.startsWith('/api/')) {
        return `${BACKEND_URL}${path.substring(4)}`;
    }
    return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(getApiPath('/api/auth/register'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Registration failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Registration API error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
