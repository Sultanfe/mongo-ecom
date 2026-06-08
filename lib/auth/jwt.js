import jwt from "jsonwebtoken";

const JWT_SECRET =
    process.env.JWT_SECRET || "mirpur-bazaar-dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";

export function generateToken(userId, role) {
    return jwt.sign({ userId, role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

export function verifyToken(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

export function getTokenFromRequest(request) {
    const header = request.headers.get("authorization") || "";
    if (header.startsWith("Bearer ")) return header.slice(7);
    return null;
}
