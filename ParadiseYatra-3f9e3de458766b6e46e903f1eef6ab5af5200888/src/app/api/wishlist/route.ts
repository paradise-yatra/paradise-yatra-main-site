import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/wishlists.json');

// Helper to get user ID from token (INSECURE: for demo use only, does not verify signature)
function getUserIdFromToken(token: string): string | null {
    try {
        if (!token) return null;
        // Check if it looks like a JWT
        if (token.split('.').length === 3) {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
            return decoded.id || decoded._id || decoded.sub;
        }
        // Fallback: use token as ID if it's not a JWT (e.g. dev/test token)
        return token;
    } catch (e) {
        return token; // Fallback
    }
}

async function getWishlistData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return { wishlists: {} };
    }
}

async function saveWishlistData(data: any) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET: Fetch user's wishlist
export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization");
        const headerUserId = request.headers.get("X-User-Id");
        // Prefer header user ID if provided (internal trusted call), otherwise extract from token
        const userId = headerUserId || getUserIdFromToken(token || "");

        console.log(`API GET Wishlist - UserID: ${userId}`);

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const data = await getWishlistData();
        const userWishlist = data.wishlists[userId] || [];

        console.log(`API GET Wishlist - Found ${userWishlist.length} searchItems`);

        return NextResponse.json({ wishlist: userWishlist });
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
        const headerUserId = request.headers.get("X-User-Id");
        const userId = headerUserId || getUserIdFromToken(token || "");

        const body = await request.json();
        const { packageId } = body;

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        console.log(`API POST Wishlist - UserID: ${userId}, PackageID: ${packageId}`);

        if (!packageId) {
            return NextResponse.json({ message: "Package ID required" }, { status: 400 });
        }

        const data = await getWishlistData();
        const currentWishlist = data.wishlists[userId] || [];

        let newWishlist;
        const index = currentWishlist.indexOf(packageId);

        if (index > -1) {
            // Remove
            newWishlist = currentWishlist.filter((id: string) => id !== packageId);
        } else {
            // Add
            newWishlist = [...currentWishlist, packageId];
        }

        data.wishlists[userId] = newWishlist;
        await saveWishlistData(data);

        return NextResponse.json({
            success: true,
            wishlist: newWishlist,
            message: index > -1 ? "Removed from wishlist" : "Added to wishlist"
        });
    } catch (error) {
        console.error("Wishlist POST error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
