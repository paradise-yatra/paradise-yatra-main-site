const User = require('../models/User');
const Signup = require('../models/Signup');
const mongoose = require('mongoose');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        // req.user is already populated by auth middleware
        res.json({ wishlist: req.user.wishlist || [] });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Toggle item in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res) => {
    try {
        const { packageId } = req.body;
        console.log('Toggle wishlist request - User:', req.user._id, 'Package:', packageId);

        if (!packageId) {
            return res.status(400).json({ message: 'Package ID is required' });
        }

        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize wishlist if it doesn't exist
        if (!user.wishlist) {
            user.wishlist = [];
        }

        // Convert all existing wishlist items to strings for comparison
        const wishlistStrings = user.wishlist.map(id => id.toString());
        const index = wishlistStrings.indexOf(packageId.toString());

        console.log('Current wishlist status:', {
            wishlistCount: user.wishlist.length,
            indexFound: index
        });

        if (index > -1) {
            // Remove from wishlist
            user.wishlist.splice(index, 1);
            console.log('Removing from wishlist...');
        } else {
            // Add to wishlist
            user.wishlist.push(packageId);
            console.log('Adding to wishlist...');
        }

        // Explicitly mark wishlist as modified (sometimes needed for arrays)
        user.markModified('wishlist');

        const savedUser = await user.save();
        console.log('User saved successfully. New wishlist length:', savedUser.wishlist.length);

        res.json({
            success: true,
            wishlist: savedUser.wishlist,
            message: index > -1 ? 'Removed from wishlist' : 'Added to wishlist'
        });
    } catch (error) {
        console.error('Toggle wishlist error details:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

