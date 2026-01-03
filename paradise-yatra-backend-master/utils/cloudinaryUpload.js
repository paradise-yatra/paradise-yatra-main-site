// const cloudinary = require("../config/cloudinary");
// const fs = require("fs");

// /**
//  * Dynamic folder mapping based on category
//  * You can add more categories here as needed
//  */
// const getFolderPath = (category) => {
//   const folderMap = {
//     // Packages
//     'trending-destinations': 'paradise-yatra/packages/trending-destinations',
//     'popular-packages': 'paradise-yatra/packages/popular-packages',
//     'holiday-packages': 'paradise-yatra/packages/holiday-packages',
//     'adventure-packages': 'paradise-yatra/packages/adventure-packages',
    
//     // Other content types
//     'blogs': 'paradise-yatra/blogs',
//     'testimonials': 'paradise-yatra/testimonials',
//     'destinations': 'paradise-yatra/destinations',
//     'hero': 'paradise-yatra/hero',
//     'cta': 'paradise-yatra/cta',
//     'holiday-types': 'paradise-yatra/holiday-types',
//   };

//   // If category exists in map, use it; otherwise create dynamic folder
//   if (folderMap[category]) {
//     return folderMap[category];
//   }

//   // For dynamic categories (like "Beach Holidays", "Mountain Tours")
//   // Convert to safe folder name
//   const safeCategoryName = category
//     .toLowerCase()
//     .replace(/\s+/g, '-')
//     .replace(/[^a-z0-9-]/g, '');
  
//   return `paradise-yatra/packages/${safeCategoryName}`;
// };

// /**
//  * Upload image to Cloudinary with dynamic folder
//  * @param {String} filePath - Local file path from multer
//  * @param {String} category - Category for folder routing
//  * @param {String} oldPublicId - Optional: public_id of old image to delete
//  */
// const uploadToCloudinary = async (filePath, category = "default", oldPublicId = null) => {
//   try {
//     const folder = getFolderPath(category);

//     // Upload new image
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder: folder,
//       use_filename: true,
//       unique_filename: true,
//       overwrite: false,
//       transformation: [
//         { quality: "auto", fetch_format: "auto" }
//       ],
//     });

//     // Delete local temp file
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

//     // Delete old Cloudinary image if provided
//     if (oldPublicId) {
//       try {
//         await cloudinary.uploader.destroy(oldPublicId);
//         console.log(`Deleted old image: ${oldPublicId}`);
//       } catch (deleteError) {
//         console.error(`Failed to delete old image ${oldPublicId}:`, deleteError.message);
//         // Don't throw - new image uploaded successfully
//       }
//     }

//     return {
//       url: result.secure_url,
//       public_id: result.public_id,
//       asset_id: result.asset_id,
//     };
//   } catch (error) {
//     // Clean up local file on error
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }
//     throw new Error(`Cloudinary upload failed: ${error.message}`);
//   }
// };

// /**
//  * Upload multiple images
//  */
// const uploadMultipleToCloudinary = async (files, category = "default") => {
//   try {
//     const fileArray = Array.isArray(files) ? files : [files];
//     const folder = getFolderPath(category);

//     const uploadPromises = fileArray.map((file) =>
//       cloudinary.uploader.upload(file.path, {
//         folder: folder,
//         use_filename: true,
//         unique_filename: true,
//       })
//     );

//     const results = await Promise.all(uploadPromises);

//     // Cleanup local files
//     fileArray.forEach((file) => {
//       if (fs.existsSync(file.path)) {
//         fs.unlinkSync(file.path);
//       }
//     });

//     return results.map((result) => ({
//       url: result.secure_url,
//       public_id: result.public_id,
//     }));
//   } catch (error) {
//     // Cleanup on error
//     const fileArray = Array.isArray(files) ? files : [files];
//     fileArray.forEach((file) => {
//       if (fs.existsSync(file.path)) {
//         fs.unlinkSync(file.path);
//       }
//     });
//     throw new Error(`Multiple upload failed: ${error.message}`);
//   }
// };

// /**
//  * Delete image from Cloudinary
//  */
// const deleteFromCloudinary = async (publicId) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
//     return result;
//   } catch (error) {
//     throw new Error(`Cloudinary delete failed: ${error.message}`);
//   }
// };

// /**
//  * Extract public_id from Cloudinary URL
//  */
// const extractPublicId = (cloudinaryUrl) => {
//   if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') return null;
  
//   // Check if it's a Cloudinary URL
//   if (!cloudinaryUrl.includes('cloudinary.com')) return null;
  
//   // Extract public_id from URL
//   // Example: https://res.cloudinary.com/xxx/image/upload/v123/paradise-yatra/packages/trending/image.jpg
//   const matches = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
//   return matches ? matches[1] : null;
// };

// module.exports = {
//   uploadToCloudinary,
//   uploadMultipleToCloudinary,
//   deleteFromCloudinary,
//   extractPublicId,
//   getFolderPath, // Export for reference
// };

const cloudinary = require("../config/cloudinary");
const fs = require("fs");

/**
 * Dynamic folder mapping based on content type and category
 */
const getFolderPath = (contentType, category = null) => {
  // Pre-defined folder mappings
  const folderMap = {
    // Content types
    'destinations': 'paradise-yatra/destinations',
    'blogs': 'paradise-yatra/blogs',
    'testimonials': 'paradise-yatra/testimonials',
    'hero': 'paradise-yatra/hero',
    'cta': 'paradise-yatra/cta',
    'holiday-types': 'paradise-yatra/holiday-types',
    
    // Package categories
    'trending-destinations': 'paradise-yatra/packages/trending-destinations',
    'popular-packages': 'paradise-yatra/packages/popular-packages',
    'holiday-packages': 'paradise-yatra/packages/holiday-packages',
    'adventure-packages': 'paradise-yatra/packages/adventure-packages',
  };

  // If direct match found in folderMap
  if (folderMap[contentType]) {
    return folderMap[contentType];
  }

  // For packages with category
  if (contentType === 'packages' && category) {
    const safeCategoryName = category
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    return `paradise-yatra/packages/${safeCategoryName}`;
  }

  // For dynamic categories (backward compatibility with old code)
  if (contentType && contentType.includes('-')) {
    const safeCategoryName = contentType
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    return `paradise-yatra/packages/${safeCategoryName}`;
  }

  // Default fallback
  return `paradise-yatra/${contentType || 'default'}`;
};

/**
 * Upload image to Cloudinary with dynamic folder
 * @param {String} filePath - Local file path from multer
 * @param {String} contentTypeOrCategory - Content type (destinations, packages, blogs) OR legacy category string
 * @param {String} category - Optional: Category for packages (used when first param is 'packages')
 * @param {String} oldPublicId - Optional: public_id of old image to delete
 */
const uploadToCloudinary = async (filePath, contentTypeOrCategory = "misc", category = null, oldPublicId = null) => {
  // Support legacy single-parameter usage: uploadToCloudinary(path, 'trending-destinations')
  const contentType = contentTypeOrCategory;
  
  // If no category provided and contentType looks like a category, extract it
  if (!category && contentType && contentType.includes('-')) {
    // This is likely a legacy category parameter
    category = contentType;
  }
  
  try {
    if (!filePath) {
      throw new Error("File path is required");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error("File does not exist");
    }

    const folder = getFolderPath(contentType, category);

    console.log(`Uploading to Cloudinary folder: ${folder}`);

    // Upload new image
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      transformation: [
        { quality: "auto", fetch_format: "auto" }
      ],
    });

    console.log(`Upload successful: ${result.secure_url}`);

    // Delete local temp file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete old Cloudinary image if provided
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
        console.log(`Deleted old image: ${oldPublicId}`);
      } catch (deleteError) {
        console.error(`Failed to delete old image ${oldPublicId}:`, deleteError.message);
        // Don't throw - new image uploaded successfully
      }
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
      asset_id: result.asset_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    // Clean up local file on error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Upload multiple images
 */
const uploadMultipleToCloudinary = async (files, contentType = "misc", category = null) => {
  try {
    const fileArray = Array.isArray(files) ? files : [files];
    const folder = getFolderPath(contentType, category);

    const uploadPromises = fileArray.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: folder,
        use_filename: true,
        unique_filename: true,
        transformation: [
          { quality: "auto", fetch_format: "auto" }
        ],
      })
    );

    const results = await Promise.all(uploadPromises);

    // Cleanup local files
    fileArray.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    return results.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));
  } catch (error) {
    // Cleanup on error
    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
    throw new Error(`Multiple upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.warn("No public_id provided for deletion");
      return null;
    }
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted from Cloudinary: ${publicId}`, result);
    return result;
  } catch (error) {
    console.error(`Cloudinary delete error for ${publicId}:`, error);
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Extract public_id from Cloudinary URL
 */
const extractPublicId = (cloudinaryUrl) => {
  if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') return null;
  
  // Check if it's a Cloudinary URL
  if (!cloudinaryUrl.includes('cloudinary.com')) return null;
  
  // Extract public_id from URL
  // Example: https://res.cloudinary.com/xxx/image/upload/v123/paradise-yatra/packages/popular-packages/image.jpg
  const matches = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return matches ? matches[1] : null;
};

module.exports = {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
  getFolderPath,
};