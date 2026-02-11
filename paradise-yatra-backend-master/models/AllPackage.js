const mongoose = require('mongoose');

const allPackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    // Reference to HolidayType for better categorization
    holidayType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HolidayType',
        required: false
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: false,
        trim: true
    },
    tourType: {
        type: String,
        enum: ['international', 'india'],
        required: true,
        default: 'india'
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    originalPrice: {
        type: Number,
        min: 0
    },
    discount: {
        type: Number,
        min: 0,
        max: 100
    },
    duration: {
        type: String
    },
    highlights: [{
        type: String
    }],
    inclusions: [{
        type: String,
        trim: true
    }],
    exclusions: [{
        type: String,
        trim: true
    }],
    itinerary: [{
        day: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        activities: [{
            type: String,
            required: true
        }],
        accommodation: {
            type: String,
            required: false
        },
        meals: {
            type: String,
            required: false
        },
        image: {
            type: String,
            default: ""
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    visitCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }]
}, {
    timestamps: true
});

// Add indexes for better search performance
allPackageSchema.index({ name: 'text', description: 'text', location: 'text' });
allPackageSchema.index({ isActive: 1 });
allPackageSchema.index({ name: 1 });
allPackageSchema.index({ slug: 1 });
allPackageSchema.index({ location: 1 });
allPackageSchema.index({ holidayType: 1 });
allPackageSchema.index({ country: 1 });
allPackageSchema.index({ state: 1 });
allPackageSchema.index({ tourType: 1 });
allPackageSchema.index({ tourType: 1, country: 1 });
allPackageSchema.index({ tourType: 1, state: 1 });
allPackageSchema.index({ country: 1, state: 1 });

module.exports = mongoose.model('AllPackage', allPackageSchema);
