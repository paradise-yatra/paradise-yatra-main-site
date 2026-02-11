const AllPackage = require("../models/AllPackage");
const { processSingleImage } = require("../utils/imageUtils");
const { uploadToCloudinary, extractPublicId, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

// Helper function to generate slug from name
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .trim("-"); // Remove leading/trailing hyphens
};

// Helper function to ensure unique slug
const ensureUniqueSlug = async (baseSlug, existingId = null) => {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const query = { slug };
        if (existingId) {
            query._id = { $ne: existingId };
        }

        const existing = await AllPackage.findOne(query);
        if (!existing) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
    }
};

// Helper function to transform image paths to full URLs
const transformPackageImageUrl = (pkg) => {
    if (pkg.image) {
        pkg.image = processSingleImage(pkg.image);
    }
    return pkg;
};

// Get all packages
const getAllPackages = async (req, res) => {
    try {
        const {
            limit = 100,
            page = 1,
            tourType,
            country,
            state,
            isActive,
            q
        } = req.query;

        let query = {};

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        if (tourType && ["international", "india"].includes(tourType)) {
            query.tourType = tourType;
        }

        // Helper function to escape regex special characters
        const escapeRegExp = (string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };

        if (country) {
            // Create a flexible regex that allows spaces or hyphens between words
            // This handles cases where URL slug "united-arab-emirates" matches DB entry "United Arab Emirates"
            // Replace both spaces AND hyphens with a pattern that matches either
            const safeCountry = escapeRegExp(country.trim()).replace(/[\s-]+/g, '[\\s-]+');
            query.country = { $regex: new RegExp(safeCountry, "i") };
        }

        if (state) {
            // Create a flexible regex that allows spaces or hyphens between words
            // This handles cases where URL slug decoding (hyphens -> spaces) matches DB entries with hyphens or varying whitespace
            // Replace both spaces AND hyphens with a pattern that matches either
            const safeState = escapeRegExp(state.trim()).replace(/[\s-]+/g, '[\\s-]+');
            query.state = { $regex: new RegExp(safeState, "i") };
        }

        if (q) {
            query.$or = [
                { name: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } }
            ];
        }

        let packages = await AllPackage.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        let total = await AllPackage.countDocuments(query);

        // Transform image URLs
        const transformedPackages = packages.map((pkg) =>
            transformPackageImageUrl(pkg.toObject())
        );

        res.json({
            packages: transformedPackages,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / parseInt(limit)),
                hasNext: parseInt(page) * parseInt(limit) < total,
                hasPrev: parseInt(page) > 1,
                totalItems: total
            },
        });
    } catch (error) {
        console.error("Get all packages error:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Get single package
const getPackage = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if it's a valid ObjectId (24 character hex string)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

        let pkg;
        if (isObjectId) {
            // Query by ObjectId
            pkg = await AllPackage.findById(id);
        } else {
            // Query by slug
            pkg = await AllPackage.findOne({ slug: id });
        }

        if (!pkg) {
            return res.status(404).json({ message: "Package not found." });
        }

        // Increment visit count
        pkg.visitCount += 1;
        await pkg.save();

        // Transform image URL
        const transformedPackage = transformPackageImageUrl(pkg.toObject());

        res.json(transformedPackage);
    } catch (error) {
        console.error("Get package error:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Create package (Admin only)
const createPackage = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = [
            "name",
            "description",
            "shortDescription",
            "location",
            "country",
            "tourType"
        ];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `${field} is required` });
            }
        }

        // Validate tour type
        const validTourTypes = ["international", "india"];
        if (!validTourTypes.includes(req.body.tourType)) {
            return res.status(400).json({
                message: "Invalid tour type. Must be one of: international, india",
            });
        }

        // Generate slug from custom slug or name
        let baseSlug;
        if (req.body.slug && req.body.slug.trim()) {
            // Use custom slug if provided
            baseSlug = generateSlug(req.body.slug);
        } else {
            // Auto-generate from name if slug is empty
            baseSlug = generateSlug(req.body.name);
        }
        req.body.slug = await ensureUniqueSlug(baseSlug);

        // If image file is uploaded, upload to Cloudinary
        if (req.file) {
            console.log('📤 Uploading package image to Cloudinary...');
            const cloudinaryResult = await uploadToCloudinary(
                req.file.path,
                'all-packages',
                null,
                null
            );
            req.body.image = cloudinaryResult.url;
            console.log('✅ Package image uploaded:', cloudinaryResult.url);
        }

        // Validate that image is provided (either via file upload or URL)
        if (!req.body.image) {
            return res.status(400).json({ message: 'Image is required (upload a file or provide a URL)' });
        }

        // Parse JSON fields if they come as strings
        if (typeof req.body.itinerary === 'string') {
            try {
                req.body.itinerary = JSON.parse(req.body.itinerary);
            } catch (e) {
                console.error("Failed to parse itinerary JSON", e);
            }
        }

        if (typeof req.body.tags === 'string' && req.body.tags.startsWith('[')) {
            try {
                req.body.tags = JSON.parse(req.body.tags);
            } catch (e) {
                console.error("Failed to parse tags JSON", e);
            }
        }

        const pkg = new AllPackage(req.body);
        await pkg.save();

        // Transform image URL
        const transformedPackage = transformPackageImageUrl(pkg.toObject());

        res.status(201).json({
            message: "Package created successfully",
            package: transformedPackage,
        });
    } catch (error) {
        console.error("Create package error:", error);
        res
            .status(500)
            .json({ message: "Server error during package creation." });
    }
};

// Update package (Admin only)
const updatePackage = async (req, res) => {
    try {
        // Validate tour type if provided
        if (req.body.tourType) {
            const validTourTypes = ["international", "india"];
            if (!validTourTypes.includes(req.body.tourType)) {
                return res.status(400).json({
                    message: "Invalid tour type. Must be one of: international, india",
                });
            }
        }

        // Generate slug from custom slug or name if being updated
        if (req.body.slug !== undefined || req.body.name) {
            let baseSlug;
            if (req.body.slug !== undefined) {
                // If slug is explicitly provided (even if empty), use it or generate from name
                if (req.body.slug.trim()) {
                    baseSlug = generateSlug(req.body.slug);
                } else if (req.body.name) {
                    baseSlug = generateSlug(req.body.name);
                } else {
                    // If slug is empty and no name provided, get existing package name
                    const existingPkg = await AllPackage.findById(req.params.id);
                    if (existingPkg) {
                        baseSlug = generateSlug(existingPkg.name);
                    }
                }
            } else if (req.body.name) {
                // Only name is being updated, generate slug from new name
                baseSlug = generateSlug(req.body.name);
            }

            if (baseSlug) {
                req.body.slug = await ensureUniqueSlug(baseSlug, req.params.id);
            }
        }

        // If image file is uploaded, upload to Cloudinary and delete old image
        if (req.file) {
            console.log('📤 Uploading new package image to Cloudinary...');

            // Get the old image public_id for cleanup
            const existingPkg = await AllPackage.findById(req.params.id);
            const oldPublicId = existingPkg?.image ? extractPublicId(existingPkg.image) : null;

            const cloudinaryResult = await uploadToCloudinary(
                req.file.path,
                'all-packages',
                null,
                oldPublicId // This will delete the old image
            );
            req.body.image = cloudinaryResult.url;
            console.log('✅ Package image updated:', cloudinaryResult.url);
        }

        // Parse JSON fields if they come as strings
        if (typeof req.body.itinerary === 'string') {
            try {
                req.body.itinerary = JSON.parse(req.body.itinerary);
            } catch (e) {
                console.error("Failed to parse itinerary JSON", e);
            }
        }

        if (typeof req.body.tags === 'string' && req.body.tags.startsWith('[')) {
            try {
                req.body.tags = JSON.parse(req.body.tags);
            } catch (e) {
                console.error("Failed to parse tags JSON", e);
            }
        }

        const pkg = await AllPackage.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!pkg) {
            return res.status(404).json({ message: "Package not found." });
        }

        // Transform image URL
        const transformedPackage = transformPackageImageUrl(pkg.toObject());

        res.json({
            message: "Package updated successfully",
            package: transformedPackage,
        });
    } catch (error) {
        console.error("Update package error:", error);
        res
            .status(500)
            .json({ message: "Server error during package update." });
    }
};

// Delete package (Admin only)
const deletePackage = async (req, res) => {
    try {
        const pkg = await AllPackage.findByIdAndDelete(req.params.id);

        if (!pkg) {
            return res.status(404).json({ message: "Package not found." });
        }

        // Delete image from Cloudinary if it exists
        if (pkg.image) {
            const publicId = extractPublicId(pkg.image);
            if (publicId) {
                try {
                    await deleteFromCloudinary(publicId);
                    console.log('🗑️ Deleted package image from Cloudinary:', publicId);
                } catch (deleteError) {
                    console.error('Failed to delete image from Cloudinary:', deleteError.message);
                    // Don't fail the request if image deletion fails
                }
            }
        }

        res.json({ message: "Package deleted successfully" });
    } catch (error) {
        console.error("Delete package error:", error);
        res
            .status(500)
            .json({ message: "Server error during package deletion." });
    }
};

module.exports = {
    getAllPackages,
    getPackage,
    createPackage,
    updatePackage,
    deletePackage
};
