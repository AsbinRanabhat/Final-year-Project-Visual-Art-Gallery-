const express = require("express");
const {
    initiatePayment,
    verifyPayment,
    getUserOrders,
} = require("../controller/payment/khaltiController");
const { isAuthenticated } = require("../middleware/middlewareAuth");

const router = express.Router();

// Initiate Khalti payment (requires login)
router.route("/payment/initiate").post(isAuthenticated, initiatePayment);

// Verify payment after Khalti redirect (public — pidx in query)
router.route("/payment/verify").get(verifyPayment);

// Get logged-in user's orders
router.route("/payment/orders").get(isAuthenticated, getUserOrders);

module.exports = router;
