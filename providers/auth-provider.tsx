"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/lib/types";
import { auth } from "@/lib/api/auth";
import { useRouter, usePathname } from "next/navigation";
import { getAuthToken } from "@/lib/api/client";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    loginWithGoogle: (data: any) => Promise<void>;
    loginWithApple: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const refreshUser = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                setLoading(false);
                return;
            }
            const userData = await auth.me();
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user:", error);
            // If error (e.g. 401), clear user
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        await auth.login(email, password);
        await refreshUser();
        router.push("/");
    };

    const register = async (data: any) => {
        await auth.register(data);
        await refreshUser();
        router.push("/");
    };

    const loginWithGoogle = async (data: any) => {
        await auth.loginWithGoogle(data);
        await refreshUser();
        router.push("/");
    };

    const loginWithApple = async (data: any) => {
        await auth.loginWithApple(data);
        await refreshUser();
        router.push("/");
    };

    const logout = () => {
        auth.logout();
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, loginWithGoogle, loginWithApple }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
