const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    destination: {
        type: String,
        required: false,
        trim: true
    },
    budget: {
        type: String,
        required: false,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    packageTitle: {
        type: String,
        required: false
    },
    packagePrice: {
        type: String,
        required: false
    },
    newsletterConsent: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'lost', 'won'],
        default: 'new'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);
