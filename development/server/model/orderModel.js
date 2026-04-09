const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Order must belong to a user"],
        },
        items: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: [true, "Total amount is required"],
        },
        khaltiPidx: {
            type: String,
            default: null,
        },
        transactionId: {
            type: String,
            default: null,
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Completed", "Failed", "Refunded"],
            default: "Pending",
        },
        paymentMethod: {
            type: String,
            default: "Khalti",
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
