"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.email || !form.password) {
            setError("Please enter your email and password");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }

            login(data.token, data.user);

            if (data.user.role === "admin" || data.user.role === "super_admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-1">
                    Welcome Back
                </h1>
                <p className="text-gray-500 text-center mb-6">
                    Login to your Mirpur Bazaar account
                </p>

                {error && (
                    <div className="mb-4 px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={onChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    {"Don\u2019t have an account?"}{" "}
                    <Link
                        href="/auth/register"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
