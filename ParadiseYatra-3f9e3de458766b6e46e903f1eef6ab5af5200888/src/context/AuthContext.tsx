"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchWishlist, toggleWishlist as toggleWishlistAction, clearWishlist } from "@/redux/features/wishlistSlice";

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    wishlist: string[];
    toggleWishlist: (packageId: string) => void;
    isInWishlist: (packageId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const { items: wishlist } = useSelector((state: RootState) => state.wishlist);

    useEffect(() => {
        const savedToken = localStorage.getItem("auth_token");
        const savedUser = localStorage.getItem("auth_user");

        if (savedToken && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(parsedUser);

                // Fetch wishlist from Redux
                dispatch(fetchWishlist({ token: savedToken, userId: parsedUser.id || parsedUser._id }));
            } catch (error) {
                console.error("Error parsing saved user:", error);
                localStorage.removeItem("auth_token");
                localStorage.removeItem("auth_user");
            }
        }
        setIsLoading(false);
    }, [dispatch]);

    const login = (newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem("auth_token", newToken);
        localStorage.setItem("auth_user", JSON.stringify(userData));

        // Fetch wishlist
        dispatch(fetchWishlist({ token: newToken, userId: userData.id || (userData as any)._id }));

        router.push("/");
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        dispatch(clearWishlist());
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        router.push("/login");
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem("auth_user", JSON.stringify(updatedUser));
        }
    };

    const toggleWishlist = (packageId: string) => {
        if (!user || !token) return;
        dispatch(toggleWishlistAction({
            packageId,
            token,
            userId: user.id || (user as any)._id
        }));
    };

    const isInWishlist = (packageId: string) => {
        return wishlist.includes(packageId);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser, wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
