
// /routes/general.js

const express = require("express");
const router = express.Router();
const General = require("../models/General");
const { authenticateToken, isAdmin } = require("../middleware/auth");

/**
 * GET /general
 * Public → returns the single General doc (or null if none)
 */
router.get("/", async (req, res) => {
  try {
    const info = await General.findOne();
    if (!info) {
      return res.status(404).json({ message: "General info not set." });
    }
    return res.json(info);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
});

/**
 * PUT /general
 * Admin → create/update the single General doc.
 * Body can include:
 *   { contactPhone, contactEmail, contactAddress, businessHours }
 *
 * If no document exists, this will create one; otherwise update.
 */
router.put("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const updates = {};
    if (req.body.contactPhone) updates.contactPhone = req.body.contactPhone.trim();
    if (req.body.contactEmail) updates.contactEmail = req.body.contactEmail.toLowerCase().trim();
    if (req.body.contactAddress) updates.contactAddress = req.body.contactAddress.trim();
    if (req.body.Instagram) updates.Instagram = req.body.Instagram.toLowerCase().trim();
    if (req.body.Facebook) updates.Facebook = req.body.Facebook.toLowerCase().trim();
    // if (req.body.Whatsaap) updates.Whatsaap = req.body.Whatsaap.toLowerCase().trim();
    

    if (req.body.whatsaap) { // Note the 'whatsaap' spelling from your original request body
      const rawWhatsapp = req.body.whatsaap;

      if (typeof rawWhatsapp !== "string") {
        return res
          .status(400)
          .json({ message: "WhatsApp input must be a string." });
      }

      let fullLink = rawWhatsapp.trim();

      // If it already looks like a wa.me or whatsapp.com URL, accept it as-is
      if (
        /^https?:\/\//i.test(fullLink) &&
        /(wa\.me|whatsapp\.com)\/\+?\d+/.test(fullLink)
      ) {
        updates.Whatsaap = fullLink; // Use 'Whatsaap' to match your schema
      } else {
        // Otherwise, assume it's a phone number
        const digitsOnly = fullLink.replace(/\D+/g, "");
        if (digitsOnly.length < 6) {
          return res
            .status(400)
            .json({ message: "Invalid WhatsApp phone number format." });
        }
        updates.Whatsaap = `https://wa.me/${digitsOnly}`; // Use 'Whatsaap' to match your schema
      }
    }


    let general = await General.findOne();
    if (!general) {
      general = new General(updates);
      await general.save();
      return res.status(201).json(general);
    }

    general.set(updates);
    await general.save();
    return res.json(general);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid data." });
  }
});

module.exports = router;
