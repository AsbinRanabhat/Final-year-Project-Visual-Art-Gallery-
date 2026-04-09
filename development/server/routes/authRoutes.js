const express = require("express");
const { userRegister, userLogin, userLogout, verifyOtp, forgotPassword, verifyEmail, resendVerificationOtp, resetPassword } = require("../controller/auth/authController");
const router = express.Router();
router.route("/register").post(userRegister)
router.route("/login").post(userLogin)
router.route("/logout").post(userLogout)
router.route("/resend-verification-otp").post(resendVerificationOtp)
router.route("/verify-email").post(verifyEmail)
router.route("/verify-otp").post(verifyOtp)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password").post(resetPassword)
module.exports = router;
