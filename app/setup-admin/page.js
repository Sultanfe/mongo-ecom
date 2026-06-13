"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * /setup-admin
 * ------------
 * Public, one-time helper for the site owner. Has two tabs:
 *
 *  1. CREATE a brand new super_admin (or promote an existing
 *     user with a different email).
 *  2. PROMOTE an existing user by email — the simplest path
 *     when you've already registered someone (like
 *     sultanfero8@gmail.com) and just want to flip their
 *     role to admin in the DB.
 *
 * Both tabs post to API endpoints that are gated by
 * BOOTSTRAP_SECRET so random visitors can't use them.
 */
export default function SetupAdminPage() {
    const [tab, setTab] = useState("promote"); // "create" | "promote"

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white">
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Admin Setup
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Owner only · gated by BOOTSTRAP_SECRET
                            </p>
                        </div>
                    </div>

                    <div className="my-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                        <strong>Before you start:</strong> Make sure{" "}
                        <code>BOOTSTRAP_SECRET</code> is set in your{" "}
                        <code>.env</code> and the dev server has been
                        restarted. The endpoints on this page refuse to do
                        anything without that secret.
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-5">
                        <button
                            onClick={() => setTab("promote")}
                            className={`flex-1 py-2 text-sm font-semibold transition ${
                                tab === "promote"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Promote existing user
                        </button>
                        <button
                            onClick={() => setTab("create")}
                            className={`flex-1 py-2 text-sm font-semibold transition ${
                                tab === "create"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Create new super_admin
                        </button>
                    </div>

                    {tab === "promote" ? (
                        <PromoteForm />
                    ) : (
                        <CreateForm />
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
                        Already have an admin account?{" "}
                        <Link
                            href="/auth/login"
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            Log in
                        </Link>{" "}
                        and go to{" "}
                        <Link
                            href="/admin/users"
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            user management
                        </Link>{" "}
                        to change roles from the UI.
                    </div>
                </div>

                <details className="mt-6 bg-white rounded-2xl shadow p-5 text-sm text-gray-700">
                    <summary className="font-semibold cursor-pointer text-gray-900">
                        💡 Prefer to do it directly in MongoDB?
                    </summary>
                    <div className="mt-3 space-y-2 text-xs leading-relaxed">
                        <p>
                            You can flip the role straight from{" "}
                            <code>mongosh</code> or MongoDB Compass:
                        </p>
                        <pre className="bg-gray-900 text-green-300 p-3 rounded overflow-x-auto">{`// mongosh
use mirpur-ecom        // or your DB name
db.users.updateOne(
  { email: "sultanfero8@gmail.com" },
  { $set: { role: "super_admin" } }
)`}</pre>
                        <p>
                            The next time that user logs in, the JWT will
                            carry <code>role: "super_admin"</code> and they
                            will instantly get the Admin link in the navbar.
                        </p>
                    </div>
                </details>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Tab 1: Promote an existing user by email                                  */
/* -------------------------------------------------------------------------- */
function PromoteForm() {
    const [form, setForm] = useState({
        email: "",
        role: "super_admin",
        secret: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const update = (key, value) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setResult(null);
        try {
            const res = await fetch("/api/setup/promote-by-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email.trim(),
                    role: form.role,
                    secret: form.secret,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setResult({ ok: false, message: data.error || "Failed" });
            } else {
                setResult({ ok: true, message: data.message });
                setForm({ email: "", role: "super_admin", secret: "" });
            }
        } catch (err) {
            setResult({ ok: false, message: "Network error" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
                Type the email of an already-registered user (for example{" "}
                <code>sultanfero8@gmail.com</code>) and pick the new role.
                We'll write the change directly to MongoDB.
            </p>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    User email
                </label>
                <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="sultanfero8@gmail.com"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    New role
                </label>
                <select
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                >
                    <option value="super_admin">super_admin (full power)</option>
                    <option value="admin">admin (manage content + users)</option>
                    <option value="vendor">vendor (sell products)</option>
                    <option value="customer">customer (regular user)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    BOOTSTRAP_SECRET <span className="text-red-500">*</span>
                </label>
                <input
                    required
                    type="password"
                    value={form.secret}
                    onChange={(e) => update("secret", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Paste from your .env"
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
                {submitting ? "Updating…" : "Promote to role"}
            </button>

            {result && (
                <div
                    className={`px-4 py-3 rounded text-sm ${
                        result.ok
                            ? "bg-green-50 border border-green-200 text-green-700"
                            : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                >
                    {result.ok ? "✓ " : "✗ "}
                    {result.message}
                </div>
            )}
        </form>
    );
}

/* -------------------------------------------------------------------------- */
/*  Tab 2: Create a brand-new super_admin (or promote by email at the same time) */
/* -------------------------------------------------------------------------- */
function CreateForm() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        secret: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [showPw, setShowPw] = useState(false);

    const update = (key, value) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setResult(null);
        try {
            const res = await fetch("/api/seed-admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-bootstrap-secret": form.secret,
                },
                body: JSON.stringify({
                    fullName: form.fullName.trim(),
                    email: form.email.trim(),
                    password: form.password,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setResult({ ok: false, message: data.error || "Failed" });
            } else {
                setResult({
                    ok: true,
                    message: data.message || "super_admin created",
                });
                setForm({ fullName: "", email: "", password: "", secret: "" });
            }
        } catch (err) {
            setResult({ ok: false, message: "Network error" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
                Use this if you want to create a brand-new admin from
                scratch. If the email is already registered, that existing
                user is promoted to <code>super_admin</code> instead.
            </p>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full name
                </label>
                <input
                    required
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Site Owner"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                </label>
                <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="you@example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                    If this email is already registered, that user is
                    promoted instead of duplicated.
                </p>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                </label>
                <div className="relative">
                    <input
                        required
                        type={showPw ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => update("password", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        placeholder="At least 6 characters"
                        minLength={6}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                    >
                        {showPw ? "Hide" : "Show"}
                    </button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    BOOTSTRAP_SECRET{" "}
                    <span className="text-red-500">*</span>
                </label>
                <input
                    required
                    type="password"
                    value={form.secret}
                    onChange={(e) => update("secret", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    placeholder="Paste the value from your .env"
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
                {submitting ? "Creating…" : "Create / Promote super_admin"}
            </button>

            {result && (
                <div
                    className={`mt-2 px-4 py-3 rounded text-sm ${
                        result.ok
                            ? "bg-green-50 border border-green-200 text-green-700"
                            : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                >
                    {result.ok ? "✓ " : "✗ "}
                    {result.message}
                </div>
            )}
        </form>
    );
}
               