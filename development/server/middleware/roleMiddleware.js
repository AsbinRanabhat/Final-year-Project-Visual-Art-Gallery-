const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

/**
 * AUTHENTICATION MIDDLEWARE
 * Verifies the JWT token from the Request Header.
 */
const isAuthenticated = async (req, res, next) => {
    try {
        let token;

        // 1. Check if token exists in Authorization Header (Bearer Token)
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication failed: No token provided." 
            });
        }

        // 2. Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Find User associated with this token (excluding password for security)
        const currentUser = await User.findById(decoded.id).select("-userPassword");

        if (!currentUser) {
            return res.status(401).json({ 
                success: false, 
                message: "The user belonging to this token no longer exists." 
            });
        }

        // 4. Attach User to the Request object for use in next middleware/controllers
        req.user = currentUser;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ 
            success: false, 
            message: "Invalid or expired token. Please log in again." 
        });
    }
};

/**
 * AUTHORIZATION MIDDLEWARE
 * Restricts access to specific roles (e.g., 'admin', 'vendor', 'artist').
 */
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user is available because isAuthenticated must run before this
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access Denied: Your role (${req.user?.role || 'Guest'}) does not have permission for this action.`
            });
        }
        next();
    };
};

module.exports = { isAuthenticated, restrictTo };