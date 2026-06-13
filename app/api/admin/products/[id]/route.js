import connectDB from "@/app/lib/db";
import Product from "@/models/Product";
import { verifyToken, getTokenFromRequest } from "@/lib/auth/jwt";

/**
 * PUT    /api/admin/products/[id]   — update an existing product
 * DELETE /api/admin/products/[id]   — delete a product
 *
 * Both require the caller to be an admin or super_admin.
 */

function isValidId(id) {
    return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}

// Update a product
export async function PUT(request, { params }) {
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

        const { id } = await params;
        if (!isValidId(id)) {
            return Response.json(
                { error: "Invalid product id" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const allowed = [
            "title",
            "description",
            "price",
            "category",
            "image",
            "featured",
        ];
        const update = {};
        for (const key of allowed) {
            if (key in body) update[key] = body[key];
        }

        if ("price" in update && typeof update.price !== "number") {
            return Response.json(
                { error: "price must be a number" },
                { status: 400 }
            );
        }
        if ("title" in update && !update.title) {
            return Response.json(
                { error: "title cannot be empty" },
                { status: 400 }
            );
        }

        const product = await Product.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return Response.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { product: product.toJSON() },
            { status: 200 }
        );
    } catch (err) {
        console.error("Admin update product error:", err);
        return Response.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}

// Delete a product
export async function DELETE(request, { params }) {
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

        const { id } = await params;
        if (!isValidId(id)) {
            return Response.json(
                { error: "Invalid product id" },
                { status: 400 }
            );
        }

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return Response.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { message: "Product deleted", id },
            { status: 200 }
        );
    } catch (err) {
        console.error("Admin delete product error:", err);
        return Response.json(
            { error: "Failed to delete product" },
            { status: 500 }
        );
    }
}
