import connectDB from "@/app/lib/db";
import User from "@/models/User";
import { verifyToken, getTokenFromRequest } from "@/lib/auth/jwt";

// List all users (admin only) — used by the admin dashboard to show
// who has registered in the system.
export async function GET(request) {
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

        const users = await User.find({})
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();

        // Normalize ObjectIds to strings for JSON safety
        const data = users.map((u) => ({
            ...u,
            _id: u._id.toString(),
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
        }));

        return Response.json({ users: data }, { status: 200 });
    } catch (err) {
        console.error("List users error:", err);
        return Response.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
