import { NextRequest, NextResponse } from "next/server";
import API_CONFIG from "@/config/api";

// GET: Fetch user's wishlist
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization");

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const populate = searchParams.get('populate');

        // Forward URL params
        const backendUrl = API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.WISHLIST.GET) + (populate ? `?populate=${populate}` : '');
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
        console.error("Wishlist GET proxy error:", error);
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
        let body;
        try {
            body = await request.json();
        } catch (e) {
            console.error("Failed to parse request body in wishlist route");
            return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
        }

        if (!token) {
            console.error("Unauthorized: No token provided in wishlist route");
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const backendUrl = API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.WISHLIST.TOGGLE);
        console.log(`[Wishlist Proxy] Toggling at: ${backendUrl}`);
        console.log(`[Wishlist Proxy] Request Body:`, JSON.stringify(body));

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        });

        console.log(`[Wishlist Proxy] Backend status: ${response.status}`);

        let data;
        const text = await response.text();
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error(`[Wishlist Proxy] Failed to parse backend response JSON: ${text}`);
            return NextResponse.json({ message: "Invalid backend response" }, { status: 502 });
        }

        if (!response.ok) {
            console.error(`[Wishlist Proxy] Backend error:`, data);
            return NextResponse.json({ message: data.message || 'Failed to update wishlist', backendError: data }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[Wishlist Proxy] Wishlist POST error:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
