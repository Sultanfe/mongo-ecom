import connectDB from "@/lib/db";
import Product from "@/models/Product";

/**
 * GET /api/categories
 * -------------------
 * Returns the list of distinct categories from the products
 * collection, alongside the count of products in each one.
 * Also mixes in a small map of emoji icons for known category
 * names so the home page can render nice category cards.
 */
const CATEGORY_ICONS = {
    electronics: "💻",
    electrical: "💻",
    footwear: "👟",
    shoes: "👟",
    apparel: "👕",
    clothing: "👕",
    kitchen: "🍳",
    sports: "⚽",
    "home decor": "🛋️",
    decor: "🛋️",
    furniture: "🛋️",
    beauty: "💄",
    books: "📚",
    toys: "🧸",
    grocery: "🛒",
    accessories: "👜",
    watches: "⌚",
    bags: "👜",
    health: "💊",
    default: "🛍️",
};

function getEmoji(name) {
    if (!name) return CATEGORY_ICONS.default;
    const key = name.toLowerCase().trim();
    if (CATEGORY_ICONS[key]) return CATEGORY_ICONS[key];
    // Fallback: see if any key is a substring of the name
    for (const k of Object.keys(CATEGORY_ICONS)) {
        if (key.includes(k)) return CATEGORY_ICONS[k];
    }
    return CATEGORY_ICONS.default;
}

export async function GET() {
    try {
        await connectDB();

        // Aggregate distinct categories with counts.
        const raw = await Product.aggregate([
            { $match: { category: { $exists: true, $ne: null, $ne: "" } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } },
        ]);

        const categories = raw.map((row) => ({
            name: row._id,
            count: row.count,
            emoji: getEmoji(row._id),
        }));

        return Response.json({ categories });
    } catch (err) {
        console.error("Categories fetch error:", err);
        return Response.json({ categories: [] }, { status: 500 });
    }
}
