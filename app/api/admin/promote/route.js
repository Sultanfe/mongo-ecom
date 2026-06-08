import connectDB from "@/app/lib/db";
import User from "@/models/User";
import { verifyToken, getTokenFromRequest } from "@/lib/auth/jwt";

// Promote a user to admin or super_admin.
// Requires the caller to already be an admin or super_admin.
//
// POST /api/admin/promote
//   { "userId": "<id>", "role": "admin" | "super_admin" }
export async function POST(request) {
    try {
        await connectDB();

        const token = getTokenFromRequest(request);
        const decoded = verifyToken(token);

        if (!decoded) {
            return Response.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        if (decoded.role !== "admin" && decoded.role !== "super_admin") {
            return Response.json(
                { error: "Admin access required" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { userId, role } = body || {};

        if (!userId) {
            return Response.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const allowedRoles = ["customer", "vendor", "admin", "super_admin"];
        if (!allowedRoles.includes(role)) {
            return Response.json(
                { error: "Invalid role" },
                { status: 400 }
            );
        }

        // Only super_admins can create other admins/super_admins.
        if (
            (role === "admin" || role === "super_admin") &&
            decoded.role !== "super_admin"
        ) {
            return Response.json(
                { error: "Only super_admin can promote to admin or super_admin" },
                { status: 403 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return Response.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        user.role = role;
        await user.save();

        return Response.json(
            { message: "Role updated", user: user.toJSON() },
            { status: 200 }
        );
    } catch (err) {
        console.error("Promote user error:", err);
        return Response.json(
            { error: "Failed to update role" },
            { status: 500 }
        );
    }
}
