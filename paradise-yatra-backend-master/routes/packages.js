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
    // Debug: Log all body fields to see what we're getting
    console.log('📦 req.body keys:', Object.keys(req.body || {}));
    console.log('📦 req.body.category:', req.body?.category);
    console.log('📦 Full req.body:', JSON.stringify(req.body, null, 2));
    
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
      holidayType,    // 🆕 NEW - Premium type / Holiday type
      isActive,
      isFeatured
    } = req.body;

    let imageUrl = null;
    
    // Upload image to Cloudinary if file exists
    if (req.file) {
      // HARDCODE 'premium-packages' for this route - same pattern as destinations.js uses 'popular-packages'
      // This ensures images ALWAYS go to the correct folder regardless of what category is sent
      const result = await uploadToCloudinary(req.file.path, 'premium-packages');
      imageUrl = result.url;
      
      // Verify the URL contains the correct path
      if (!imageUrl.includes('paradise-yatra/packages/premium-packages')) {
        console.error('❌ ERROR: Image uploaded to wrong folder!');
        console.error('❌ Expected: paradise-yatra/packages/premium-packages');
        console.error('❌ Got:', imageUrl);
        throw new Error('Image uploaded to incorrect Cloudinary folder');
      }
      
      console.log('✅ Image uploaded successfully to premium-packages folder:', imageUrl);
    }

    // Parse highlights if it's a string
    const parsedHighlights = typeof highlights === 'string' 
      ? JSON.parse(highlights) 
      : highlights;

    // Generate slug if not provided
    let finalSlug = slug;
    if (!finalSlug || finalSlug.trim() === '') {
      // Generate slug from title
      const generateSlug = (text) => {
        return text
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim("-");
      };
      
      let baseSlug = generateSlug(title);
      let uniqueSlug = baseSlug;
      let counter = 1;
      
      // Ensure slug is unique
      while (await Package.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      finalSlug = uniqueSlug;
    }

    // Validate tourType - ensure it's present and valid
    const validTourTypes = ['india', 'international'];
    const finalTourType = tourType && validTourTypes.includes(tourType) ? tourType : 'india';

    // Handle images: Use uploaded file URL, or check req.body.images (if ImageUpload already uploaded it)
    let finalImages = [];
    if (imageUrl) {
      // Image uploaded via req.file
      finalImages = [imageUrl];
    } else if (req.body.images) {
      // Image already uploaded by ImageUpload component (Cloudinary URL in req.body.images)
      // Parse images if it's a string (JSON), otherwise use as-is
      const imagesArray = typeof req.body.images === 'string' 
        ? JSON.parse(req.body.images) 
        : Array.isArray(req.body.images) 
          ? req.body.images 
          : [req.body.images];
      
      if (imagesArray && imagesArray.length > 0 && imagesArray[0]) {
        console.log('✅ Image URL from body (already uploaded by client):', imagesArray[0]);
        finalImages = imagesArray;
      }
    }

    // Prepare package data
    const packageData = {
      title,
      description,
      shortDescription,
      images: finalImages,
      category,
      country,
      state,
      tourType: finalTourType,
      price: parseFloat(price),
      rating: parseFloat(rating) || 0,
      duration,
      destination,
      slug: finalSlug,
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
    // 🆕 Add holidayType if provided
    if (holidayType) {
      packageData.holidayType = holidayType;
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
      itinerary,      // ✅ NEW - Itinerary array
      inclusions,      // ✅ NEW - Inclusions array
      exclusions,      // ✅ NEW - Exclusions array
      holidayType,    // 🆕 NEW - Premium type / Holiday type
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
    // 🆕 Handle holidayType
    if (holidayType !== undefined) {
      pkg.holidayType = holidayType || null;
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
    // ✅ Handle itinerary
    if (itinerary !== undefined) {
      pkg.itinerary = typeof itinerary === 'string' 
        ? JSON.parse(itinerary) 
        : Array.isArray(itinerary) 
          ? itinerary 
          : [];
      console.log('✅ Updated itinerary:', pkg.itinerary?.length || 0, 'days');
    }
    // ✅ Handle inclusions
    if (inclusions !== undefined) {
      pkg.inclusions = typeof inclusions === 'string' 
        ? JSON.parse(inclusions) 
        : Array.isArray(inclusions) 
          ? inclusions 
          : [];
      console.log('✅ Updated inclusions:', pkg.inclusions?.length || 0, 'items');
    }
    // ✅ Handle exclusions
    if (exclusions !== undefined) {
      pkg.exclusions = typeof exclusions === 'string' 
        ? JSON.parse(exclusions) 
        : Array.isArray(exclusions) 
          ? exclusions 
          : [];
      console.log('✅ Updated exclusions:', pkg.exclusions?.length || 0, 'items');
    }
    if (isActive !== undefined) {
      pkg.isActive = isActive === 'true' || isActive === true;
    }
    if (isFeatured !== undefined) {
      pkg.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    // ✅ Handle image update
    if (req.file) {
      // New file uploaded - upload to Cloudinary
      // HARDCODE 'premium-packages' for this route - same pattern as destinations.js
      // Extract old image public_id for deletion
      const oldPublicId = pkg.images && pkg.images.length > 0 
        ? extractPublicId(pkg.images[0]) 
        : null;
      
      // Upload new image and delete old one - ALWAYS use 'premium-packages'
      const result = await uploadToCloudinary(req.file.path, 'premium-packages', oldPublicId);
      
      // Verify the URL contains the correct path
      if (!result.url.includes('paradise-yatra/packages/premium-packages')) {
        console.error('❌ ERROR: Image uploaded to wrong folder!');
        console.error('❌ Expected: paradise-yatra/packages/premium-packages');
        console.error('❌ Got:', result.url);
        throw new Error('Image uploaded to incorrect Cloudinary folder');
      }
      
      console.log('✅ Image updated successfully to premium-packages folder:', result.url);
      pkg.images = [result.url];
    } else if (req.body.images) {
      // No file uploaded but images field provided (e.g., ImageUpload component already uploaded it)
      // Parse images if it's a string (JSON), otherwise use as-is
      const imagesArray = typeof req.body.images === 'string' 
        ? JSON.parse(req.body.images) 
        : Array.isArray(req.body.images) 
          ? req.body.images 
          : [req.body.images];
      
      if (imagesArray && imagesArray.length > 0 && imagesArray[0]) {
        console.log('✅ Image URL updated from body (already uploaded by client):', imagesArray[0]);
        pkg.images = imagesArray;
      }
    }

    await pkg.save();
    console.log('✅ Package saved successfully with ID:', pkg._id);
    console.log('✅ Package itinerary count:', pkg.itinerary?.length || 0);
    console.log('✅ Package inclusions count:', pkg.inclusions?.length || 0);
    console.log('✅ Package exclusions count:', pkg.exclusions?.length || 0);
    res.json({ package: pkg });
  } catch (error) {
    console.error("Update package error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', adminAuth, deletePackage);

module.exports = router;