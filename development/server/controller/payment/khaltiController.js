const axios = require("axios");
const Order = require("../../model/orderModel");

// POST /payment/initiate
exports.initiatePayment = async (req, res) => {
    try {
        const { items, totalAmount } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // 1. Create a pending order in the database
        const order = await Order.create({
            user: req.user._id,
            items: items.map((item) => ({
                product: item._id,
                productName: item.productName,
                productPrice: item.productPrice,
                quantity: item.quantity || 1,
            })),
            totalAmount,
            paymentStatus: "Pending",
        });

        // 2. Call Khalti e-Payment initiate API
        // Amount must be in paisa (1 NPR = 100 paisa)
        const amountInPaisa = Math.round(totalAmount * 100);

        const khaltiResponse = await axios.post(
            `${process.env.KHALTI_BASE_URL}/epayment/initiate/`,
            {
                return_url: `${process.env.CLIENT_URL}/payment/success`,
                website_url: process.env.CLIENT_URL,
                amount: amountInPaisa,
                purchase_order_id: order._id.toString(),
                purchase_order_name: `Art Gallery Order #${order._id.toString().slice(-6)}`,
                customer_info: {
                    name: req.user.userName,
                    email: req.user.userEmail,
                    phone: String(req.user.userPhoneNumber),
                },
            },
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // 3. Store the pidx and return the payment URL
        order.khaltiPidx = khaltiResponse.data.pidx;
        await order.save();

        return res.status(200).json({
            success: true,
            paymentUrl: khaltiResponse.data.payment_url,
            pidx: khaltiResponse.data.pidx,
            orderId: order._id,
        });
    } catch (error) {
        console.error("Khalti initiate error:", error?.response?.data || error.message);
        return res.status(500).json({
            message: "Failed to initiate payment",
            error: error?.response?.data || error.message,
        });
    }
};

// GET /payment/verify?pidx=xxx
exports.verifyPayment = async (req, res) => {
    try {
        const { pidx } = req.query;

        if (!pidx) {
            return res.status(400).json({ message: "pidx is required" });
        }

        // 1. Call Khalti lookup API
        const khaltiResponse = await axios.post(
            `${process.env.KHALTI_BASE_URL}/epayment/lookup/`,
            { pidx },
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const paymentData = khaltiResponse.data;

        // 2. Find the order by pidx
        const order = await Order.findOne({ khaltiPidx: pidx });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // 3. Update payment status
        if (paymentData.status === "Completed") {
            order.paymentStatus = "Completed";
            order.transactionId = paymentData.transaction_id;
        } else if (paymentData.status === "Pending") {
            order.paymentStatus = "Pending";
        } else {
            order.paymentStatus = "Failed";
        }

        await order.save();

        return res.status(200).json({
            success: order.paymentStatus === "Completed",
            message:
                order.paymentStatus === "Completed"
                    ? "Payment verified successfully"
                    : `Payment status: ${order.paymentStatus}`,
            order: {
                _id: order._id,
                totalAmount: order.totalAmount,
                paymentStatus: order.paymentStatus,
                transactionId: order.transactionId,
                items: order.items,
            },
        });
    } catch (error) {
        console.error("Khalti verify error:", error?.response?.data || error.message);
        return res.status(500).json({
            message: "Payment verification failed",
            error: error?.response?.data || error.message,
        });
    }
};

// GET /payment/orders — get current user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("items.product");

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};
