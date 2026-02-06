const User = require('../models/User');
const Signup = require('../models/Signup');
const mongoose = require('mongoose');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ wishlist: user.wishlist || [] });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Toggle item in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res) => {
    try {
        const { packageId } = req.body;
        const user = req.user;

        if (!packageId) {
            return res.status(400).json({ message: 'Package ID is required' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`Toggling wishlist for user: ${user.email}, Package: ${packageId}`);

        // Initialize wishlist if it doesn't exist
        if (!user.wishlist) {
            user.wishlist = [];
        }

        // Convert both to strings for reliable comparison
        const targetId = packageId.toString();
        const wishlistStrings = user.wishlist.map(id => id.toString());

        const index = wishlistStrings.indexOf(targetId);

        if (index > -1) {
            // Remove from wishlist
            user.wishlist.splice(index, 1);
            console.log(`✅ DISPATCH: Removing package ${targetId} from wishlist of ${user.email}`);
        } else {
            // Add to wishlist
            user.wishlist.push(new mongoose.Types.ObjectId(targetId));
            console.log(`✅ DISPATCH: Adding package ${targetId} to wishlist of ${user.email}`);
        }

        // CRITICAL: Explicitly tell Mongoose the wishlist array has changed
        user.markModified('wishlist');

        const savedUser = await user.save();
        console.log(`✅ SUCCESS: Wishlist updated. New count: ${savedUser.wishlist.length}`);

        res.status(200).json({
            success: true,
            message: index > -1 ? 'Removed from wishlist' : 'Added to wishlist',
            wishlist: savedUser.wishlist
        });
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
