// const express = require('express');
// const router = express.Router();
// const { auth, adminAuth } = require('../middleware/auth');
// const { uploadPackageImages, uploadSingleImage, handleUploadError } = require('../middleware/upload');
// const {
//   getAllPackages,
//   getPackage,
//   getPackageBySlug,
//   createPackage,
//   updatePackage,
//   deletePackage,
//   getPackagesByCategory,
//   searchPackages,
//   addReview,
//   suggestPackages,
//   getPackagesByTourType,
//   getPackagesByCountry,
//   getPackagesByState,
//   getPackagesByHolidayType,
//   getAvailableCountries,
//   getAvailableTourTypes,
//   getAvailableStates
// } = require('../controllers/packageController');

// // Public routes
// router.get('/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     message: 'Packages API is running',
//     timestamp: new Date().toISOString()
//   });
// });
// router.get('/', getAllPackages);
// router.get('/search', searchPackages);
// router.get('/suggest', suggestPackages);
// router.get('/category/:category', getPackagesByCategory);
// router.get('/tour-type/:tourType', getPackagesByTourType);
// router.get('/country/:country', getPackagesByCountry);
// router.get('/state/:state', getPackagesByState);
// router.get('/holiday-type/:holidayTypeId', getPackagesByHolidayType);
// router.get('/countries', getAvailableCountries);
// router.get('/tour-types', getAvailableTourTypes);
// router.get('/states', getAvailableStates);
// router.get('/slug/:slug', getPackageBySlug);
// router.get('/:id', getPackage);

// // Protected routes
// router.post('/:id/reviews', auth, addReview);

// // Admin routes with file upload
// router.post('/', adminAuth, uploadSingleImage, handleUploadError, createPackage);
// router.put('/:id', adminAuth, uploadSingleImage, handleUploadError, updatePackage);
// router.delete('/:id', adminAuth, deletePackage);

// module.exports = router; 






// const express = require('express');
// const router = express.Router();
// const Package = require("../models/Package");
// const { adminAuth } = require("../middleware/auth"); // ✅ Already imported
// const { uploadSingleImage, uploadMultipleImages, handleUploadError } = require("../middleware/upload");
// const { uploadToCloudinary, uploadMultipleToCloudinary, extractPublicId } = require("../utils/cloudinaryUpload");
// const {
//   getAllPackages,
//   getPackage,
//   getPackageBySlug,
//   createPackage,
//   updatePackage,
//   deletePackage,
//   getPackagesByCategory,
//   searchPackages,
//   addReview,
//   suggestPackages,
//   getPackagesByTourType,
//   getPackagesByCountry,
//   getPackagesByState,
//   getPackagesByHolidayType,
//   getAvailableCountries,
//   getAvailableTourTypes,
//   getAvailableStates
// } = require('../controllers/packageController');

// // Public routes
// router.get('/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     message: 'Packages API is running',
//     timestamp: new Date().toISOString()
//   });
// });
// router.get('/', getAllPackages);
// router.get('/search', searchPackages);
// router.get('/suggest', suggestPackages);
// router.get('/category/:category', getPackagesByCategory);
// router.get('/tour-type/:tourType', getPackagesByTourType);
// router.get('/country/:country', getPackagesByCountry);
// router.get('/state/:state', getPackagesByState);
// router.get('/holiday-type/:holidayTypeId', getPackagesByHolidayType);
// router.get('/countries', getAvailableCountries);
// router.get('/tour-types', getAvailableTourTypes);
// router.get('/states', getAvailableStates);
// router.get('/slug/:slug', getPackageBySlug);
// router.get('/:id', getPackage);

// // Protected routes - ✅ FIXED: Changed 'auth' to 'adminAuth' since you don't have 'auth' imported
// router.post('/:id/reviews', adminAuth, addReview);

// // Admin routes with file upload
// // ✅ CREATE Package with Cloudinary
// router.post("/", adminAuth, uploadSingleImage, handleUploadError, async (req, res) => {
//   try {
//     const { 
//       title, 
//       description, 
//       shortDescription, 
//       category,
//       country,
//       state,
//       tourType,
//       price,
//       originalPrice,  // 🆕 NEW
//       discount,       // 🆕 NEW
//       rating,
//       duration,
//       destination,
//       slug,
//       highlights,
//       isActive,
//       isFeatured
//     } = req.body;

//     let imageUrl = null;
    
//     // Upload image to Cloudinary if file exists
//     if (req.file) {
//       const uploadCategory = category ? category.toLowerCase().replace(/\s+/g, '-') : 'default';
//       const result = await uploadToCloudinary(req.file.path, uploadCategory);
//       imageUrl = result.url;
//     }

//     // Parse highlights if it's a string
//     const parsedHighlights = typeof highlights === 'string' 
//       ? JSON.parse(highlights) 
//       : highlights;

//     const newPackage = await Package.create({
//       title,
//       description,
//       shortDescription,
//       images: imageUrl ? [imageUrl] : [],
//       category,
//       country,
//       state,
//       tourType,
//       price: parseFloat(price),
//       rating: parseFloat(rating) || 0,
//       duration,
//       destination,
//       slug,
//       highlights: parsedHighlights || [],
//       isActive: isActive === 'true' || isActive === true,
//       isFeatured: isFeatured === 'true' || isFeatured === true,
//     });

//     res.status(201).json(newPackage);
//   } catch (error) {
//     console.error("Create package error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // ✅ UPDATE Package with Cloudinary (handles image replacement)
// router.put("/:id", adminAuth, uploadSingleImage, handleUploadError, async (req, res) => {
//   try {
//     const pkg = await Package.findById(req.params.id);
//     if (!pkg) {
//       return res.status(404).json({ message: "Package not found" });
//     }

//     const { 
//       title, 
//       description, 
//       shortDescription, 
//       category,
//       country,
//       state,
//       tourType,
//       price,
//       originalPrice,  // 🆕 NEW
//       discount,       // 🆕 NEW
//       rating,
//       duration,
//       destination,
//       slug,
//       highlights,
//       isActive,
//       isFeatured
//     } = req.body;

//     // Update fields
//     if (title) pkg.title = title;
//     if (description) pkg.description = description;
//     if (shortDescription) pkg.shortDescription = shortDescription;
//     if (category) pkg.category = category;
//     if (country) pkg.country = country;
//     if (state) pkg.state = state;
//     if (tourType) pkg.tourType = tourType;
//     if (price) pkg.price = parseFloat(price);
//     if (rating) pkg.rating = parseFloat(rating);
//     if (duration) pkg.duration = duration;
//     if (destination) pkg.destination = destination;
//     if (slug) pkg.slug = slug;
//     if (highlights) {
//       pkg.highlights = typeof highlights === 'string' 
//         ? JSON.parse(highlights) 
//         : highlights;
//     }
//     if (isActive !== undefined) {
//       pkg.isActive = isActive === 'true' || isActive === true;
//     }
//     if (isFeatured !== undefined) {
//       pkg.isFeatured = isFeatured === 'true' || isFeatured === true;
//     }

//     // ✅ Handle image update with old image cleanup
//     if (req.file) {
//       const uploadCategory = category ? category.toLowerCase().replace(/\s+/g, '-') : 'default';
      
//       // Extract old image public_id for deletion
//       const oldPublicId = pkg.images && pkg.images.length > 0 
//         ? extractPublicId(pkg.images[0]) 
//         : null;
      
//       // Upload new image and delete old one
//       const result = await uploadToCloudinary(req.file.path, uploadCategory, oldPublicId);
//       pkg.images = [result.url];
//     }

//     await pkg.save();
//     res.json(pkg);
//   } catch (error) {
//     console.error("Update package error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// router.delete('/:id', adminAuth, deletePackage);

// module.exports = router;

const express = require('express');
const router = express.Router();
const Package = require("../models/Package");
const { adminAuth } = require("../middleware/auth");
const { uploadSingleImage, uploadMultipleImages, handleUploadError } = require("../middleware/upload");
const { uploadToCloudinary, uploadMultipleToCloudinary, extractPublicId } = require("../utils/cloudinaryUpload");
const {
  getAllPackages,
  getPackage,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
  getPackagesByCategory,
  searchPackages,
  addReview,
  suggestPackages,
  getPackagesByTourType,
  getPackagesByCountry,
  getPackagesByState,
  getPackagesByHolidayType,
  getAvailableCountries,
  getAvailableTourTypes,
  getAvailableStates
} = require('../controllers/packageController');

// Public routes
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Packages API is running',
    timestamp: new Date().toISOString()
  });
});
router.get('/', getAllPackages);
router.get('/search', searchPackages);
router.get('/suggest', suggestPackages);
router.get('/category/:category', getPackagesByCategory);
router.get('/tour-type/:tourType', getPackagesByTourType);
router.get('/country/:country', getPackagesByCountry);
router.get('/state/:state', getPackagesByState);
router.get('/holiday-type/:holidayTypeId', getPackagesByHolidayType);
router.get('/countries', getAvailableCountries);
router.get('/tour-types', getAvailableTourTypes);
router.get('/states', getAvailableStates);
router.get('/slug/:slug', getPackageBySlug);
router.get('/:id', getPackage);

// Protected routes
router.post('/:id/reviews', adminAuth, addReview);

// Admin routes with file upload
// ✅ CREATE Package with Cloudinary + originalPrice/discount
router.post("/", adminAuth, uploadSingleImage, handleUploadError, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      shortDescription, 
      category,
      country,
      state,
      tourType,
      price,
      originalPrice,  // 🆕 NEW
      discount,       // 🆕 NEW
      rating,
      duration,
      destination,
      slug,
      highlights,
      isActive,
      isFeatured
    } = req.body;

    let imageUrl = null;
    
    // Upload image to Cloudinary if file exists
    if (req.file) {
      const uploadCategory = category ? category.toLowerCase().replace(/\s+/g, '-') : 'default';
      const result = await uploadToCloudinary(req.file.path, uploadCategory);
      imageUrl = result.url;
    }

    // Parse highlights if it's a string
    const parsedHighlights = typeof highlights === 'string' 
      ? JSON.parse(highlights) 
      : highlights;

    // Prepare package data
    const packageData = {
      title,
      description,
      shortDescription,
      images: imageUrl ? [imageUrl] : [],
      category,
      country,
      state,
      tourType,
      price: parseFloat(price),
      rating: parseFloat(rating) || 0,
      duration,
      destination,
      slug,
      highlights: parsedHighlights || [],
      isActive: isActive === 'true' || isActive === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
    };

    // 🆕 Add originalPrice and discount if provided
    if (originalPrice) {
      packageData.originalPrice = parseFloat(originalPrice);
    }
    if (discount !== undefined && discount !== null && discount !== '') {
      packageData.discount = parseFloat(discount);
    }

    const newPackage = await Package.create(packageData);

    res.status(201).json(newPackage);
  } catch (error) {
    console.error("Create package error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ UPDATE Package with Cloudinary + originalPrice/discount
router.put("/:id", adminAuth, uploadSingleImage, handleUploadError, async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    const { 
      title, 
      description, 
      shortDescription, 
      category,
      country,
      state,
      tourType,
      price,
      originalPrice,  // 🆕 NEW
      discount,       // 🆕 NEW
      rating,
      duration,
      destination,
      slug,
      highlights,
      isActive,
      isFeatured
    } = req.body;

    // Update fields
    if (title) pkg.title = title;
    if (description) pkg.description = description;
    if (shortDescription) pkg.shortDescription = shortDescription;
    if (category) pkg.category = category;
    if (country) pkg.country = country;
    if (state !== undefined) pkg.state = state;  // Allow empty string
    if (tourType) pkg.tourType = tourType;
    if (price) pkg.price = parseFloat(price);
    
    // 🆕 Handle originalPrice and discount
    if (originalPrice !== undefined) {
      pkg.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    }
    if (discount !== undefined) {
      pkg.discount = discount !== null && discount !== '' ? parseFloat(discount) : 0;
    }
    
    if (rating !== undefined) pkg.rating = parseFloat(rating);
    if (duration) pkg.duration = duration;
    if (destination) pkg.destination = destination;
    if (slug) pkg.slug = slug;
    if (highlights) {
      pkg.highlights = typeof highlights === 'string' 
        ? JSON.parse(highlights) 
        : highlights;
    }
    if (isActive !== undefined) {
      pkg.isActive = isActive === 'true' || isActive === true;
    }
    if (isFeatured !== undefined) {
      pkg.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    // ✅ Handle image update with old image cleanup
    if (req.file) {
      const uploadCategory = category ? category.toLowerCase().replace(/\s+/g, '-') : 'default';
      
      // Extract old image public_id for deletion
      const oldPublicId = pkg.images && pkg.images.length > 0 
        ? extractPublicId(pkg.images[0]) 
        : null;
      
      // Upload new image and delete old one
      const result = await uploadToCloudinary(req.file.path, uploadCategory, oldPublicId);
      pkg.images = [result.url];
    }

    await pkg.save();
    res.json(pkg);
  } catch (error) {
    console.error("Update package error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', adminAuth, deletePackage);

module.exports = router;