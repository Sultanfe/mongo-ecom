import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(request) {
    try {
        await connectDB();

        const {
            fullName,
            email,
            phone,
            address,
            city,
            postalCode,
            cardNumber,
            cardExpiry,
            items,
            subtotal,
            shipping,
            tax,
            total,
        } = await request.json();

        // Validate required fields
        if (!fullName || !email || !phone || !address || !city || !postalCode || !cardNumber || !cardExpiry) {
            return Response.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create new order
        const newOrder = new Order({
            fullName,
            email,
            phone,
            address,
            city,
            postalCode,
            cardNumber: cardNumber.slice(-4).padStart(cardNumber.length, '*'), // Mask card number
            cardExpiry,
            items,
            subtotal,
            shipping,
            tax,
            total,
            status: 'confirmed',
        });

        await newOrder.save();

        return Response.json(
            {
                message: "Order placed successfully",
                orderId: newOrder._id,
                orderRef: `MB${newOrder._id.toString().slice(-8).toUpperCase()}`,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating order:", error);
        return Response.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
