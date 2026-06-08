import connectDB from "@/app/lib/db";
import User from "@/models/User";
import { verifyToken, getTokenFromRequest } from "@/lib/auth/jwt";

export async function GET(request) {
    try {
        await connectDB();

        const token = getTokenFromRequest(request);
        if (!token) {
            return Response.json({ user: null }, { status: 200 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return Response.json({ user: null }, { status: 200 });
        }

        const user = await User.findById(decoded.userId);
        if (!user || !user.isActive) {
            return Response.json({ user: null }, { status: 200 });
        }

        return Response.json({ user: user.toJSON() }, { status: 200 });
    } catch (err) {
        console.error("Auth me error:", err);
        return Response.json({ user: null }, { status: 200 });
    }
}
