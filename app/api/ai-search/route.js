import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function POST(request) {
    const { query } = await request.json();
    await connectDB();
    const products = await Product.find({
    $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
    ]
});
    return Response.json(products);
}