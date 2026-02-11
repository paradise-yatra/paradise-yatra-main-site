import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_CONFIG } from '@/config/api';

interface WishlistState {
    items: string[];
    loading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    loading: false,
    error: null,
};

// Async thunk to fetch wishlist
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async ({ token, userId }: { token: string; userId: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(API_CONFIG.getApiUrl(API_CONFIG.ENDPOINTS.WISHLIST.GET), {
                headers: {
                    'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
                    'X-User-Id': userId
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch wishlist');
            }

            const data = await response.json();
            return data.wishlist || [];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to toggle wishlist item
export const toggleWishlist = createAsyncThunk(
    'wishlist/toggleWishlist',
    async ({ packageId, token, userId }: { packageId: string; token: string; userId: string }, { rejectWithValue }) => {
        try {
            console.log(`Toggling wishlist for package: ${packageId}`);
            const response = await fetch(API_CONFIG.getApiUrl(API_CONFIG.ENDPOINTS.WISHLIST.GET), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
                    'X-User-Id': userId
                },
                body: JSON.stringify({ packageId })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(`Wishlist toggle error: Status ${response.status}`, data);
                throw new Error(data?.message || `Failed to update wishlist (Status ${response.status})`);
            }

            return { packageId, wishlist: data.wishlist };
        } catch (error: any) {
            console.error('Wishlist toggle thunk catch:', error);
            return rejectWithValue(error.message);
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Wishlist
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Toggle Wishlist
        builder
            .addCase(toggleWishlist.pending, (state, action) => {
                // Optimistic update
                const packageId = action.meta.arg.packageId;
                const exists = state.items.includes(packageId);
                if (exists) {
                    state.items = state.items.filter(id => id !== packageId);
                } else {
                    state.items.push(packageId);
                }
            })
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                // Confirm server state (optional, usually matches optimistic)
                if (action.payload.wishlist) {
                    state.items = action.payload.wishlist;
                }
            })
            .addCase(toggleWishlist.rejected, (state, action) => {
                // Revert optimistic update is tricky without keeping old state, 
                // but fetching again or undoing the logic works.
                // For simplicity, we might just let the error show and maybe refetch?
                // Or simpler: The optimistic update assumes success. If fail, toast error.

                // or just log it for debugging
                const errorMsg = action.payload as string || "Unknown error";
                console.error("Failed to sync wishlist:", errorMsg);

                // A robust undo would go here, requiring finding the ID and reversing the operation.
                // Since we have the ID in meta, we can reverse it.
                const packageId = action.meta.arg.packageId;
                const exists = state.items.includes(packageId);

                // However, since we already toggled it in pending, 'exists' is the NEW state.
                // So we just toggle it back.
                if (exists) {
                    state.items = state.items.filter(id => id !== packageId);
                } else {
                    state.items.push(packageId);
                }
            });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
