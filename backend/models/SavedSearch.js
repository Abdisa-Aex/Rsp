// models/SavedSearch.js
const mongoose = require("mongoose");

const SavedSearchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  query: {
    type: String,
    required: true,
    trim: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  filters: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SavedSearch", SavedSearchSchema);
