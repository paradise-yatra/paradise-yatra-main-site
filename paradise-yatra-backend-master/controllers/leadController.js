const Lead = require('../models/Lead');

// Create new lead
const createLead = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            destination,
            budget,
            message,
            packageTitle,
            packagePrice,
            newsletterConsent,
            timestamp
        } = req.body;

        const newLead = new Lead({
            fullName,
            email,
            phone,
            destination,
            budget,
            message,
            packageTitle,
            packagePrice,
            newsletterConsent,
            timestamp: timestamp || new Date()
        });

        await newLead.save();

        res.status(201).json({
            success: true,
            message: 'Lead saved successfully',
            data: newLead
        });
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save lead',
            error: error.message
        });
    }
};

// Get all leads (for admin)
const getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ timestamp: -1 });
        res.status(200).json({
            success: true,
            data: leads
        });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leads',
            error: error.message
        });
    }
};

// Update lead status
const updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const lead = await Lead.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Lead status updated successfully',
            data: lead
        });
    } catch (error) {
        console.error('Error updating lead status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update lead status',
            error: error.message
        });
    }
};

// Delete lead
const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findByIdAndDelete(id);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Lead deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting lead:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete lead',
            error: error.message
        });
    }
};

module.exports = {
    createLead,
    getAllLeads,
    updateLeadStatus,
    deleteLead
};
