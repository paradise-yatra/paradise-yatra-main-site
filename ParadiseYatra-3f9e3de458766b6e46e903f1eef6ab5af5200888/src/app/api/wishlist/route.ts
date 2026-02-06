import { NextRequest, NextResponse } from "next/server";

const getBackendUrl = () => {
    const nextUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const backUrl = process.env.BACKEND_URL;

    // Choose the best base URL
    let base = nextUrl || backUrl || 'http://localhost:5001';

    // Normalize: remove trailing slash
    if (base.endsWith('/')) base = base.slice(0, -1);

    // Return base URL. We'll handle /api prefix per request.
    return base;
};

const BACKEND_URL = getBackendUrl();

// Helper to get full path avoiding /api/api
const getApiPath = (path: string) => {
    const hasApiSuffix = BACKEND_URL.endsWith('/api');
    if (hasApiSuffix && path.startsWith('/api/')) {
        return `${BACKEND_URL}${path.substring(4)}`;
    }
    return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

// GET: Fetch user's wishlist
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization");

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const backendUrl = getApiPath('/api/wishlist');
        console.log(`Fetching wishlist from: ${backendUrl}`);

        const response = await fetch(backendUrl, {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            },
            cache: 'no-store'
        });

        console.log(`Backend response status: ${response.status}`);

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ message: data.message || 'Failed to fetch wishlist' }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Wishlist GET error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST: Toggle item in wishlist (Add/Remove)
export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization");
        const body = await request.json();

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const backendUrl = getApiPath('/api/wishlist/toggle');
        console.log(`Toggling wishlist at: ${backendUrl}`);

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        });

        console.log(`Backend toggle response status: ${response.status}`);

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ message: data.message || 'Failed to update wishlist' }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Wishlist POST error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
