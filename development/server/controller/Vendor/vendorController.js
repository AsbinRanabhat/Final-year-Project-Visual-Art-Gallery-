const Product = require('../../model/productModel');
const User = require('../../model/userModel');

// Get site-wide statistics for the Vendor
const getGalleryStats = async (req, res) => {
    try {
        const totalArtworks = await Product.countDocuments();
        const totalArtists = await User.countDocuments({ role: 'artist' });
        const pendingArt = await Product.countDocuments({ status: 'pending' });
        
        res.json({ totalArtworks, totalArtists, pendingArt });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve a piece of art submitted by an Artist
const approveArtwork = async (req, res) => {
    try {
        const art = await Product.findByIdAndUpdate(
            req.params.id, 
            { status: 'published' }, 
            { new: true }
        );
        res.json({ message: "Artwork approved and live!", art });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CRITICAL FIX: Explicitly export as an object so the router can find them
module.exports = {
    getGalleryStats,
    approveArtwork
};