import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    cardNumber: String,
    cardExpiry: String,
    items: [
        {
            productId: mongoose.Schema.Types.ObjectId,
            title: String,
            price: Number,
            quantity: Number,
            category: String,
        }
    ],
    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: 'pending',
    },
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
