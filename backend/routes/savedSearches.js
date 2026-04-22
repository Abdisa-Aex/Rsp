// routes/savedSearches.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const SavedSearch = require("../models/SavedSearch");

// Get user's saved searches
router.get("/", auth, async (req, res) => {
  try {
    const searches = await SavedSearch.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, savedSearches: searches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create saved search
router.post("/", auth, async (req, res) => {
  try {
    const { query, count, filters } = req.body;
    const search = new SavedSearch({
      user: req.user.id,
      query,
      count,
      filters,
    });
    await search.save();
    res.json({ success: true, savedSearch: search });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete saved search
router.delete("/:id", auth, async (req, res) => {
  try {
    await SavedSearch.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
