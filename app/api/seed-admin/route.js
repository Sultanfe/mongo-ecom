import connectDB from "@/app/lib/db";
import User from "@/models/User";

// Bootstrap the very first super_admin in the database.
// This endpoint is gated by the BOOTSTRAP_SECRET env var so it cannot be
// triggered by anyone who just guesses the URL.
//
// POST /api/seed-admin
// Headers: x-bootstrap-secret: <BOOTSTRAP_SECRET>
// Body:    { "fullName": "...", "email": "...", "password": "..." }
//
// If a super_admin already exists, this endpoint refuses to do anything —
// use /api/admin/promote (signed in as the existing super_admin) instead.
export async function POST(request) {
    try {
        const provided = request.headers.get("x-bootstrap-secret");
        const expected = process.env.BOOTSTRAP_SECRET;

        if (!expected) {
            return Response.json(
                {
                    error:
                        "BOOTSTRAP_SECRET is not configured on the server. Set it in .env to enable first-admin creation.",
                },
                { status: 503 }
            );
        }

        if (provided !== expected) {
            return Response.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        await connectDB();

        const existingSuperAdmin = await User.findOne({
            role: "super_admin",
        });
        if (existingSuperAdmin) {
            return Response.json(
                {
                    error:
                        "A super_admin already exists. Use /api/admin/promote to grant roles.",
                },
                { status: 409 }
            );
        }

        const body = await request.json();
        const { fullName, email, password } = body || {};

        if (!fullName || !email || !password) {
            return Response.json(
                { error: "fullName, email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return Response.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            // Promote existing user to super_admin instead of failing.
            existing.role = "super_admin";
            await existing.save();
            return Response.json(
                {
                    message: "Existing user promoted to super_admin",
                    user: existing.toJSON(),
                },
                { status: 200 }
            );
        }

        const user = await User.create({
            fullName,
            email: normalizedEmail,
            password,
            role: "super_admin",
        });

        return Response.json(
            {
                message: "super_admin created",
                user: user.toJSON(),
            },
            { status: 201 }
        );
    } catch (err) {
        if (err?.code === 11000) {
            return Response.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }
        console.error("Seed admin error:", err);
        return Response.json(
            { error: "Failed to seed admin" },
            { status: 500 }
        );
    }
}
