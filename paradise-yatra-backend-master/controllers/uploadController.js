const cloudinary = require("../config/cloudinary");

// Upload single image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Cloudinary automatically uploads and returns the URL
    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path, // Cloudinary URL
      filename: req.file.filename, // Cloudinary public_id
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({ message: "Server error during image upload" });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({ message: "Filename is required" });
    }

    // Delete from Cloudinary
    // filename should be the public_id (e.g., "paradise-yatra/image-123456")
    const result = await cloudinary.uploader.destroy(filename);

    if (result.result === "ok") {
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ message: "Image not found or already deleted" });
    }
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ message: "Server error during image deletion" });
  }
};

// Get all uploaded images (for admin panel)
const getAllImages = async (req, res) => {
  try {
    // Fetch images from Cloudinary folder
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "paradise-yatra/", // Fetch from paradise-yatra folder
      max_results: 500,
    });

    const images = result.resources.map((resource) => ({
      filename: resource.public_id,
      url: resource.secure_url,
      size: resource.bytes,
      format: resource.format,
      created_at: resource.created_at,
    }));

    res.json({ images });
  } catch (error) {
    console.error("Get images error:", error);
    res.status(500).json({ message: "Server error while fetching images" });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  getAllImages,
};
