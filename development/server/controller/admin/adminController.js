const User = require("../../model/userModel");
const Product = require("../../model/productModel");

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
    try {
        // Find all users but don't send back their passwords
        const users = await User.find().select("-userPassword").sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching users: " + error.message 
        });
    }
};

/**
 * @desc    Update user role (e.g., Promote to Artist or Vendor)
 * @route   PUT /api/admin/users/role/:id
 */
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        // Ensure the role being assigned is valid
        const validRoles = ["customer", "artist", "vendor", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role assigned." });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select("-userPassword");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: `User role updated to ${role}`,
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Prevent admin from deleting themselves accidentally
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot delete your own admin account." });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User and associated data removed."
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get Gallery Dashboard Stats
 * @route   GET /api/admin/stats
 */
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalArtworks = await Product.countDocuments();
        const artistCount = await User.countDocuments({ role: "artist" });
        const pendingArtworks = await Product.countDocuments({ status: "pending" });

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalArtworks,
                artistCount,
                pendingArtworks
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Exporting as an object to match your routes require statement
module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAdminStats
};