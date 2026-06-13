import connectDB from "@/app/lib/db";
import Product from "@/models/Product";
import { verifyToken, getTokenFromRequest } from "@/lib/auth/jwt";

/**
 * GET  /api/admin/products
 *   Returns the full product list (admin-only). Includes
 *   optional `?q=` text search across title/description/category.
 *
 * POST /api/admin/products
 *   Body: { title, description, price, category, image, featured? }
 *   Creates a new product.
 *
 * Both require the caller to be an admin or super_admin.
 */

// List products (admin only)
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

        const { searchParams } = new URL(request.url);
        const q = (searchParams.get("q") || "").trim();
        const filter = q
            ? {
                  $or: [
                      { title: { $regex: q, $options: "i" } },
                      { description: { $regex: q, $options: "i" } },
                      { category: { $regex: q, $options: "i" } },
                  ],
              }
            : {};

        const products = await Product.find(filter)
            .sort({ createdAt: -1, _id: -1 })
            .lean();

        const data = products.map((p) => ({
            ...p,
            _id: p._id.toString(),
        }));

        return Response.json({ products: data }, { status: 200 });
    } catch (err) {
        console.error("Admin list products error:", err);
        return Response.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

// Create a new product (admin only)
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
        const { title, description, price, category, image, featured } =
            body || {};

        if (!title || !category || typeof price !== "number") {
            return Response.json(
                {
                    error: "title, category and a numeric price are required",
                },
                { status: 400 }
            );
        }
        if (price < 0) {
            return Response.json(
                { error: "Price cannot be negative" },
                { status: 400 }
            );
        }

        const product = await Product.create({
            title: String(title).trim(),
            description: description ? String(description).trim() : "",
            price,
            category: String(category).trim(),
            image: image ? String(image).trim() : "",
            featured: Boolean(featured),
        });

        return Response.json(
            { product: product.toJSON() },
            { status: 201 }
        );
    } catch (err) {
        console.error("Admin create product error:", err);
        return Response.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}
