const mongoose = require("mongoose");
const AdminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: { type: String, required: true },
  targetType: { type: String, enum: ["user", "resource", "report"] },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("AdminLog", AdminLogSchema);
