"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/lib/types";
import { auth } from "@/lib/api/auth";
import { useRouter, usePathname } from "next/navigation";
import { getAuthToken } from "@/lib/api/client";
import { hasCompletedOnboarding, markOnboardingDone } from "@/lib/onboarding";
import { settings } from "@/lib/api/settings";
import { getSafeAuthNext } from "@/lib/auth-redirect";

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

function postAuthRedirect(router: ReturnType<typeof useRouter>, isNewUser: boolean) {
    if (isNewUser || !hasCompletedOnboarding()) {
        router.push("/onboarding");
        return;
    }
    const next = getSafeAuthNext();
    router.push(next || "/");
}

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
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    // Soft gate: only nudge home/plaza visitors who never finished onboarding locally
    useEffect(() => {
        if (loading || !user) return;
        if (pathname === "/onboarding" || pathname?.startsWith("/settings") || pathname?.startsWith("/(auth)")) return;
        if (hasCompletedOnboarding()) return;
        if (pathname === "/" || pathname === "/plaza") {
            // Existing accounts with genre prefs: treat as onboarded
            settings
                .getGenrePreferences()
                .then((prefs) => {
                    if ((prefs.preferredGenres || []).length > 0) {
                        markOnboardingDone();
                        return;
                    }
                    router.replace("/onboarding");
                })
                .catch(() => {
                    /* don't block browsing on settings failure */
                });
        }
    }, [user, loading, pathname, router]);

    const login = async (email: string, password: string) => {
        await auth.login(email, password);
        await refreshUser();
        postAuthRedirect(router, false);
    };

    const register = async (data: any) => {
        await auth.register(data);
        await refreshUser();
        postAuthRedirect(router, true);
    };

    const loginWithGoogle = async (data: any) => {
        await auth.loginWithGoogle(data);
        await refreshUser();
        postAuthRedirect(router, false);
    };

    const loginWithApple = async (data: any) => {
        await auth.loginWithApple(data);
        await refreshUser();
        postAuthRedirect(router, false);
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
