const express = require("express");
const router = express.Router();

// Import the Admin Controller (Ensure this file exists in controller/admin/)
const {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAdminStats
} = require("../controller/admin/adminController");

// Import your Auth Middleware
const { isAuthenticated, restrictTo } = require("../middleware/middlewareAuth");

/**
 * ALL ADMIN ROUTES
 * Every route here is protected: 
 * 1. User must be logged in (isAuthenticated)
 * 2. User must be an 'admin' (restrictTo)
 */
router.use(isAuthenticated, restrictTo("admin"));

// User Management
router.get("/users", getAllUsers);
router.put("/users/role/:id", updateUserRole); // Change a customer to 'artist' or 'vendor'
router.delete("/users/:id", deleteUser);

// Dashboard Statistics
router.get("/stats", getAdminStats);

module.exports = router;