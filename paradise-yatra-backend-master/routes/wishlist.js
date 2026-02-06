const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getWishlist, toggleWishlist } = require('../controllers/wishlistController');

// GET /api/wishlist
router.get('/', auth, getWishlist);

// POST /api/wishlist/toggle
router.post('/toggle', auth, toggleWishlist);

module.exports = router;
