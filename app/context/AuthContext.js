"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [hydrated, setHydrated] = useState(false);

    // Read auth from localStorage on mount (client only).
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error("Failed to read auth from storage:", err);
        } finally {
            setHydrated(true);
        }
    }, []);

    const login = (newToken, newUser) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch (err) {
            // ignore network errors during logout
        }
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        router.push("/auth/login");
    };

    const value = {
        user,
        token,
        hydrated,
        isAuthenticated: Boolean(token && user),
        isAdmin: user?.role === "admin" || user?.role === "super_admin",
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
