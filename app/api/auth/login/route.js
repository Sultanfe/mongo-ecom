import connectDB from "@/app/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/auth/jwt";
import { isValidEmail, sanitize } from "@/lib/utils/validation";

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        const email = sanitize(body?.email)?.toLowerCase();
        const password = body?.password;

        if (!email || !password) {
            return Response.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (!isValidEmail(email)) {
            return Response.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return Response.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        if (!user.isActive) {
            return Response.json(
                { error: "Your account has been deactivated" },
                { status: 403 }
            );
        }

        const ok = await user.comparePassword(password);
        if (!ok) {
            return Response.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        const token = generateToken(user._id.toString(), user.role);

        return Response.json(
            {
                message: "Login successful",
                token,
                user: user.toJSON(),
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Login error:", err);
        return Response.json(
            { error: "Login failed. Please try again." },
            { status: 500 }
        );
    }
}
