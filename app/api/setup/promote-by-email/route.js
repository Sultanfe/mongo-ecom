import connectDB from "@/app/lib/db";
import User from "@/models/User";

/**
 * POST /api/setup/promote-by-email
 * ---------------------------------
 * Owner-only helper. Pass a user's email and the new role;
 * the server looks them up in MongoDB and updates the role
 * directly. Gated by BOOTSTRAP_SECRET so random visitors
 * can't use it.
 *
 * Request body (JSON):
 *   {
 *     "email":   "user@example.com",
 *     "role":    "customer" | "vendor" | "admin" | "super_admin",
 *     "secret":  "<BOOTSTRAP_SECRET>"
 *   }
 *
 * This is the simplest way to grant admin from your database
 * perspective — you don't need to be logged in, you just need
 * to know the BOOTSTRAP_SECRET and the user's email.
 */
const ALLOWED = ["customer", "vendor", "admin", "super_admin"];

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { email, role, secret } = body || {};

        // 1. Secret check — must match BOOTSTRAP_SECRET in .env
        const expected = process.env.BOOTSTRAP_SECRET;
        if (!expected) {
            return Response.json(
                {
                    error:
                        "BOOTSTRAP_SECRET is not set on the server. Add it to .env and restart.",
                },
                { status: 503 }
            );
        }
        if (secret !== expected) {
            return Response.json(
                { error: "Forbidden — wrong BOOTSTRAP_SECRET" },
                { status: 403 }
            );
        }

        // 2. Validate input
        if (!email || typeof email !== "string") {
            return Response.json(
                { error: "email is required" },
                { status: 400 }
            );
        }
        if (!ALLOWED.includes(role)) {
            return Response.json(
                {
                    error: `role must be one of: ${ALLOWED.join(", ")}`,
                },
                { status: 400 }
            );
        }

        // 3. Connect and update
        await connectDB();
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return Response.json(
                {
                    error: `No user found with email "${normalizedEmail}". They need to register an account first.`,
                },
                { status: 404 }
            );
        }

        const previousRole = user.role;
        user.role = role;
        await user.save();

        return Response.json(
            {
                message: `Updated ${user.email} from "${previousRole}" to "${role}"`,
                user: {
                    _id: user._id.toString(),
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Promote-by-email error:", err);
        return Response.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}
