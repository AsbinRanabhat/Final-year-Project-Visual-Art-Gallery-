const User = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../services/nodeMailer");

// Treat anything except explicit "production" as a relaxed dev environment.
const isDevEnv =
    (process.env.NODE_ENV || "development").trim().toLowerCase() !== "production";

const readBool = (value, defaultValue) => {
    if (value === undefined || value === null || value === "") {
        return defaultValue;
    }

    const normalized = String(value).trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
    return defaultValue;
};

const compactEmailError = (error) => {
    const raw =
        error?.response ||
        error?.message ||
        (typeof error === "string" ? error : "");
    return String(raw).replace(/\s+/g, " ").trim();
};

const withEmailHint = (errorText) => {
    if (!errorText) return "";

    if (/WebLoginRequired/i.test(errorText)) {
        return `${errorText} (Fix: sign in to the sender Gmail account in a browser and complete any security prompts; then retry. If needed, generate a new Gmail App Password and update EMAIL_PASS.)`;
    }

    if (/application-specific password/i.test(errorText)) {
        return `${errorText} (Fix: use a Gmail App Password for EMAIL_PASS, not your normal Gmail password.)`;
    }

    if (/username and password not accepted|invalid login/i.test(errorText)) {
        return `${errorText} (Fix: check EMAIL_USER/EMAIL_PASS. For Gmail, EMAIL_PASS must be an App Password.)`;
    }

    return errorText;
};

// Dev safety valves – opt-in only (must be explicitly enabled).
// These should never be enabled in production.
const allowEmailBypass = isDevEnv && readBool(process.env.ALLOW_EMAIL_BYPASS, false);
const allowAnyLogin = isDevEnv && readBool(process.env.ALLOW_ANY_LOGIN, false);

const allowDevAuthStub = isDevEnv && readBool(process.env.ALLOW_DEV_AUTH_STUB, false);

if (allowDevAuthStub) {
    console.warn("DEV AUTH STUB enabled – login/OTP flows are bypassed.");
}
if (allowAnyLogin) {
    console.warn("ALLOW_ANY_LOGIN enabled – password checks are bypassed.");
}
if (allowEmailBypass) {
    console.warn("ALLOW_EMAIL_BYPASS enabled – email send failures will be treated as success.");
}

const sendVerificationEmail = async (email, otp) => {
    try {
        await sendEmail({
            email,
            subject: "Verify your Visual Art Gallery account",
            message: `Your verification code is ${otp}. It will expire in 10 minutes.`,
        });
        return { emailSent: true };
    } catch (error) {
        const errorText = withEmailHint(compactEmailError(error));
        console.error("Email send failed:", errorText);
        return { emailSent: false, error: errorText };
    }
};

const sendPasswordResetEmail = async (email, otp) => {
    try {
        await sendEmail({
            email,
            subject: "Reset your Visual Art Gallery password",
            message: `Your password reset code is ${otp}. It will expire in 10 minutes.`,
        });
        return { emailSent: true };
    } catch (error) {
        const errorText = withEmailHint(compactEmailError(error));
        console.error("Password reset email failed:", errorText);
        return { emailSent: false, error: errorText };
    }
};

// 1. Multi-Role Registration
exports.userRegister = async (req, res) => {
    try {
        const { 
            Username, Email, PhoneNumber, Password, role, 
            bio, portfolioUrl, specialization, // Artist fields
            businessName, panNumber, storeLocation // Vendor fields
        } = req.body;

        // Validation
        if (!Username || !Email || !PhoneNumber || !Password) {
            return res.status(400).json({ message: "Provide Username, Email, Phone, and Password" });
        }

        // Check existing user
        const userFound = await User.findOne({ userEmail: Email });
        if (userFound) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Map role-specific data
        const artistData = role === "artist" ? { bio, portfolioUrl, specialization } : {};
        const vendorData = role === "vendor" ? { businessName, panNumber, storeLocation } : {};

        // Generate Registration OTP for Email Verification
        const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();

        await User.create({
            userName: Username,
            userEmail: Email,
            userPhoneNumber: PhoneNumber,
            userPassword: hashedPassword,
            role: role || "customer",
            otp: emailOtp,
            otpExpires: Date.now() + 10 * 60 * 1000, // 10 mins
            artistData,
            vendorData
        });

        // Send OTP to email
        const { emailSent, error: emailError } = await sendVerificationEmail(
            Email,
            emailOtp
        );

        const payload = {
            message: emailSent
                ? "User registered. Please verify your email."
                : "User registered, but we could not send the verification email. Please check email settings or use resend.",
            emailSent,
        };

        if (isDevEnv && !emailSent && emailError) {
            payload.debugEmailError = emailError;
        }

        res.status(201).json(payload);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 1b. Resend Verification OTP
exports.resendVerificationOtp = async (req, res) => {
    try {
        const { Email } = req.body;

        if (!Email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const user = await User.findOne({ userEmail: Email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email already verified. Please login." });
        }

        const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = emailOtp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        const { emailSent, error: emailError } = await sendVerificationEmail(
            Email,
            emailOtp
        );

        const payload = {
            message: emailSent
                ? "Verification code resent to your email."
                : "Could not send verification email. Please check email settings.",
            emailSent,
        };

        if (isDevEnv && !emailSent && emailError) {
            payload.debugEmailError = emailError;
        }

        return res.status(200).json(payload);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// 5. Verify Email (Initial Registration)
exports.verifyEmail = async (req, res) => {
    try {
        const { Email, Otp } = req.body;

        // 1. Basic Validation
        if (!Email || !Otp) {
            return res.status(400).json({ message: "Please provide both Email and OTP" });
        }

        // 2. Find user by email
        const user = await User.findOne({ userEmail: Email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3. Check if user is already verified
        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email is already verified. Please login." });
        }

        // 4. Validate OTP and Expiry
        if (user.otp !== Otp) {
            return res.status(400).json({ message: "Invalid OTP code" });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP has expired. Please register again or request a new one." });
        }

        // 5. Update Verification Status and Clear OTP Fields
        user.isEmailVerified = true;
        user.otp = null;        // Clear the OTP so it can't be reused
        user.otpExpires = null; // Clear the expiry
        await user.save();

        res.status(200).json({ 
            message: "Email verified successfully! You can now login to your account.",
            isEmailVerified: user.isEmailVerified 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 2. Secure Login
exports.userLogin = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // 1. Validation: Check if fields are provided
        if (!Email || !Password) {
            return res.status(400).json({ message: "Please provide Email and Password" });
        }

        const normalizedEmail = Email.toLowerCase();

        // Short‑circuit in local/dev to avoid auth blockers during UI testing.
        if (allowDevAuthStub) {
            const token = jwt.sign(
                { id: "dev-user", role: "customer" },
                process.env.JWT_SECRET || "dev-secret",
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                message: "Login Successful (dev stub)",
                token,
                user: {
                    id: "dev-user",
                    userName: "Dev User",
                    userEmail: normalizedEmail,
                    role: "customer"
                }
            });
        }

        // Dev-only bypass to allow any password for demos
        if (allowAnyLogin) {
            let user = await User.findOne({ userEmail: normalizedEmail });
            if (!user) {
                const hashedPassword = await bcrypt.hash(Password, 10);
                const fallbackName = normalizedEmail.split("@")[0] || "User";
                user = await User.create({
                    userName: fallbackName,
                    userEmail: normalizedEmail,
                    userPhoneNumber: 9800000000,
                    userPassword: hashedPassword,
                    role: "customer",
                    isEmailVerified: true
                });
            } else if (!user.isEmailVerified) {
                user.isEmailVerified = true;
                await user.save();
            }

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                message: "Login Successful (dev)",
                token: token,
                user: {
                    id: user._id,
                    userName: user.userName,
                    userEmail: user.userEmail,
                    role: user.role,
                    artistData: user.role === 'artist' ? user.artistData : undefined,
                    vendorData: user.role === 'vendor' ? user.vendorData : undefined
                }
            });
        }

        // 2. Find user & include password (if you used select: false in schema)
        const user = await User.findOne({ userEmail: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found with this email" });
        }

        // 3. Security Check: Is the email verified?
        if (!user.isEmailVerified) {
            return res.status(403).json({ 
                message: "Your email is not verified. Please verify your email to login.",
                isEmailVerified: false 
            });
        }

        // 4. Password Check: Compare plain text with hashed password
        const isMatch = await bcrypt.compare(Password, user.userPassword);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // 5. Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" } // Token valid for 1 day
        );

        // 6. Success Response
        res.status(200).json({
            message: "Login Successful",
            token: token,
            user: {
                id: user._id,
                userName: user.userName,
                userEmail: user.userEmail,
                role: user.role,
                // Include role-specific data if needed
                artistData: user.role === 'artist' ? user.artistData : undefined,
                vendorData: user.role === 'vendor' ? user.vendorData : undefined
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Forgot Password (Trigger OTP)
exports.forgotPassword = async (req, res) => {
    try {
        const { Email } = req.body;

        if (!Email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const normalizedEmail = Email.toLowerCase();

        // In dev/stub mode, return a deterministic OTP without hitting DB or email.
        if (allowDevAuthStub) {
            const debugOtp = "111222";
            return res.status(200).json({
                message: "Dev stub: use the OTP shown to continue.",
                emailSent: true,
                debugOtp
            });
        }

        const user = await User.findOne({ userEmail: normalizedEmail });

        // Allow bypass even when user is missing
        if (!user) {
            if (allowEmailBypass) {
                const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();
                console.warn(`EMAIL_BYPASS active – user not found, issuing fake OTP for ${normalizedEmail}: ${fakeOtp}`);
                return res.status(200).json({
                    message: "If that email exists, we sent password reset instructions (dev bypass).",
                    emailSent: true,
                    debugOtp: fakeOtp
                });
            }
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        user.isOtpVerified = false;
        await user.save();

        const { emailSent, error: emailError } = await sendPasswordResetEmail(
            normalizedEmail,
            otp
        );

        if (!emailSent && allowEmailBypass) {
            console.warn(`EMAIL_BYPASS active – OTP for ${normalizedEmail}: ${otp}`);
            const message = emailError
                ? `Dev mode: email not sent. ${emailError}`
                : "Dev mode: email not sent. Check server logs for details.";
            return res.status(200).json({
                message,
                emailSent: true,
                debugOtp: otp,
            });
        }

        if (!emailSent) {
            const payload = {
                message: "Could not send password reset email. Please try again.",
                emailSent: false,
            };

            if (isDevEnv && emailError) {
                payload.debugEmailError = emailError;
            }

            return res.status(500).json(payload);
        }

        res.status(200).json({
            message: "Password reset OTP sent to email",
            emailSent: true
        });
    } catch (error) {
        console.error("forgotPassword fatal error:", error?.message || error);
        if (allowEmailBypass) {
            const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const payload = {
                message: "Dev mode: using fallback OTP (email bypass).",
                emailSent: true,
                debugOtp: fallbackOtp,
            };

            if (isDevEnv) {
                payload.debugEmailError = withEmailHint(compactEmailError(error));
            }

            return res.status(200).json(payload);
        }
        res.status(500).json({ message: error.message });
    }
};

// 4. Verify OTP (For Password Reset)
exports.verifyOtp = async (req, res) => {
    try {
        const { Email, Otp } = req.body;
        if (!Email || !Otp) {
            return res.status(400).json({ message: "Please provide Email and OTP" });
        }

        const normalizedEmail = Email.toLowerCase();

        if (allowDevAuthStub) {
            return res.status(200).json({ message: "OTP verified (dev stub)." });
        }

        const user = await User.findOne({ userEmail: normalizedEmail });

        if (!user || user.otp !== Otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isOtpVerified = true;
        user.otp = null; // Clear OTP after use
        await user.save();

        res.status(200).json({ message: "OTP verified. You can now reset your password." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5b. Reset Password (After OTP verification)
exports.resetPassword = async (req, res) => {
    try {
        const { Email, NewPassword } = req.body;

        if (!Email || !NewPassword) {
            return res.status(400).json({ message: "Email and new password are required." });
        }

        if (NewPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters." });
        }

        const normalizedEmail = Email.toLowerCase();

        if (allowDevAuthStub) {
            return res.status(200).json({ message: "Password reset successful (dev stub)." });
        }

        const user = await User.findOne({ userEmail: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isOtpVerified) {
            return res.status(400).json({ message: "OTP not verified. Please verify OTP first." });
        }

        const hashedPassword = await bcrypt.hash(NewPassword, 10);
        user.userPassword = hashedPassword;
        user.isOtpVerified = false;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        return res.status(200).json({ message: "Password reset successful. Please login." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// 6. Logout (stateless JWT)
exports.userLogout = async (req, res) => {
    try {
        // If a token cookie is ever used, clear it here for safety.
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
