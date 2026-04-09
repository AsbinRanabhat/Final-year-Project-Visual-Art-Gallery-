const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // --- Common Authentication Fields ---
    userName: {
        type: String,
        required: [true, "Username is required"],
        trim: true
    },
    userEmail: {
        type: String, 
        required: [true, "Email is required"],
        unique: true,
        lowercase: true
    },
    userPhoneNumber: {
        type: Number,
        required: [true, "Phone Number is required"],
    },
    userPassword: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: ["customer", "artist", "vendor", "admin"],
        default: "customer",
    },

    // --- Verification & Security Status ---
    isEmailVerified: {
        type: Boolean,
        default: false // Set to true only after initial email OTP check
    },
    isOtpVerified: {
        type: Boolean,
        default: false // Used specifically for the Forgot Password flow
    },
    otp: {
        type: String, 
        default: null
    },
    otpExpires: {
        type: Date, 
        default: null
    },

    // --- Artist Specific Attributes ---
    artistData: {
        bio: { type: String, default: "" },
        portfolioUrl: { type: String, default: "" },
        specialization: [{ type: String }], 
    },

    // --- Vendor Specific Attributes ---
    vendorData: {
        businessName: { type: String, default: "" },
        panNumber: { type: String, default: "" }, 
        storeLocation: { type: String, default: "" },
    },

    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
module.exports = User;