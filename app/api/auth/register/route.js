import connectDB from "@/app/lib/db";
import User from "@/models/User";
import { generateToken } from "@/lib/auth/jwt";
import { isValidEmail, isValidPassword, sanitize } from "@/lib/utils/validation";

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        const fullName = sanitize(body?.fullName);
        const email = sanitize(body?.email)?.toLowerCase();
        const phone = sanitize(body?.phone);
        const password = body?.password;

        if (!fullName || !email || !password) {
            return Response.json(
                { error: "Full name, email and password are required" },
                { status: 400 }
            );
        }

        if (!isValidEmail(email)) {
            return Response.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        if (!isValidPassword(password)) {
            return Response.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return Response.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        const user = await User.create({
            fullName,
            email,
            phone,
            password,
            role: "customer",
        });

        const token = generateToken(user._id.toString(), user.role);

        return Response.json(
            {
                message: "Registration successful",
                token,
                user: user.toJSON(),
            },
            { status: 201 }
        );
    } catch (err) {
        if (err?.code === 11000) {
            return Response.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }
        console.error("Registration error:", err);
        return Response.json(
            { error: "Registration failed. Please try again." },
            { status: 500 }
        );
    }
}
