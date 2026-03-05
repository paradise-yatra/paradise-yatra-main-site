const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// POST /api/contact-form - save contact form submissions to "contact-form" collection
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message, source } = req.body || {};

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Full name is required." });
    }

    if (!phone || !String(phone).trim()) {
      return res.status(400).json({ message: "Phone number is required." });
    }

    if (!subject || !String(subject).trim()) {
      return res.status(400).json({ message: "Query type is required." });
    }

    const db = mongoose.connection.db;
    const collection = db.collection("contact-form");

    const payload = {
      name: String(name).trim(),
      email: email ? String(email).trim().toLowerCase() : "",
      phone: String(phone).trim(),
      subject: String(subject).trim(),
      message: message ? String(message).trim() : "",
      source: source || "contact-page",
      status: "new",
      submittedAt: new Date(),
    };

    const result = await collection.insertOne(payload);

    return res.status(201).json({
      message: "Contact form submitted successfully.",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again." });
  }
});

module.exports = router;
