const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// 1. Authenticate User (Verify JWT)
exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({ message: "Please login to access this resource" });
        }

        // Verify Token
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        // Find user and attach to request object
        req.user = await User.findById(decodedData.id);

        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// 2. Authorize Roles (Restrict Access)
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'artist']
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role (${req.user.role}) is not allowed to access this resource`
            });
        }
        next();
    };
};