import { NextRequest, NextResponse } from "next/server";
import API_CONFIG from "@/config/api";

// GET: Fetch user's wishlist
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization");

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const backendUrl = API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.WISHLIST.GET);
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
        const body = await request.json();

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const backendUrl = API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.WISHLIST.TOGGLE);
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
        console.error("Wishlist POST proxy error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
