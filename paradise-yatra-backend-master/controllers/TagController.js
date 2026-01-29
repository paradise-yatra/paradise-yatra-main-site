const Tag = require("../models/Tag");
const Package = require("../models/Package");

// Get all tags
exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find();
        res.status(200).json({
            success: true,
            count: tags.length,
            data: tags,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// Get single tag
exports.getTag = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }
        res.status(200).json({
            success: true,
            data: tag,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// Create tag
exports.createTag = async (req, res) => {
    try {
        const tag = await Tag.create(req.body);
        res.status(201).json({
            success: true,
            data: tag,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Tag with this name already exists",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// Update tag
exports.updateTag = async (req, res) => {
    try {
        let tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }

        tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: tag,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// Delete tag
exports.deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }

        // Remove this tag from all packages
        await Package.updateMany(
            { tags: tag._id },
            { $pull: { tags: tag._id } }
        );

        await tag.deleteOne();

        res.status(200).json({
            success: true,
            message: "Tag deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// Add packages to tag
exports.addPackagesToTag = async (req, res) => {
    try {
        const { packageIds } = req.body; // Array of package IDs
        const tag = await Tag.findById(req.params.id);

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }

        // Update tag's packages array
        tag.packages = [...new Set([...tag.packages.map(p => p.toString()), ...packageIds])];
        await tag.save();

        // Update each package's tags array
        await Package.updateMany(
            { _id: { $in: packageIds } },
            { $addToSet: { tags: tag._id } }
        );

        res.status(200).json({
            success: true,
            data: tag,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

// Remove packages from tag
exports.removePackagesFromTag = async (req, res) => {
    try {
        const { packageIds } = req.body;
        const tag = await Tag.findById(req.params.id);

        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }

        tag.packages = tag.packages.filter(p => !packageIds.includes(p.toString()));
        await tag.save();

        await Package.updateMany(
            { _id: { $in: packageIds } },
            { $pull: { tags: tag._id } }
        );

        res.status(200).json({
            success: true,
            data: tag,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};
