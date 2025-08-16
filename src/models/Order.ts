import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema({
    productId: Number,
    title: String,
    price: Number,
    image: String,
    qty: Number,
    lineTotal: Number,
});

const OrderSchema = new Schema(
    {
        userUid: { type: String, index: true, required: true },
        items: [OrderItemSchema],
        subtotal: Number,
        shipping: Number,
        total: Number,
        status: { type: String, enum: ["PAID", "PENDING", "CANCELLED"], default: "PAID" },
        shippingInfo: {
            fullName: String,
            address1: String,
            city: String,
            country: String,
            zip: String,
            phone: String,
        },
    },
    { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);
