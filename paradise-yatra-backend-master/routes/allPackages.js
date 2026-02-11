const express = require('express');
const router = express.Router();
const {
    getAllPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage
} = require('../controllers/allPackageController');
const { adminAuth } = require('../middleware/auth');
const { uploadSingleImage } = require('../middleware/upload'); // Using existing upload middleware

// Public routes
router.get('/', getAllPackages);
router.get('/:id', getPackage);

// Admin routes
router.post('/', adminAuth, uploadSingleImage, createPackage);
router.put('/:id', adminAuth, uploadSingleImage, updatePackage);
router.delete('/:id', adminAuth, deletePackage);

module.exports = router;
