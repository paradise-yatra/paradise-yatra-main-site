import { NextRequest, NextResponse } from "next/server";
import API_CONFIG from "@/config/api";

// GET: Fetch user's wishlist from backend
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization");

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Forward request to backend
        const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.WISHLIST.GET), {
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { message: errorData.message || "Failed to fetch wishlist from backend" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Wishlist GET proxy error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST: Toggle item in wishlist (Add/Remove) via backend
export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization");
        const body = await request.json();
        const { packageId } = body;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!packageId) {
            return NextResponse.json({ message: "Package ID required" }, { status: 400 });
        }

        // Forward request to backend toggle endpoint
        const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.WISHLIST.TOGGLE), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
            },
            body: JSON.stringify({ packageId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { message: errorData.message || "Failed to update wishlist in backend" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Wishlist POST proxy error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
