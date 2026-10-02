// backend/scripts/cleanupOrphanedExchanges.js
const mongoose = require("mongoose");
const Exchange = require("../models/Exchange");
const Resource = require("../models/Resource");

async function cleanupOrphanedExchanges() {
  try {
    // Get all resource IDs that exist
    const existingResourceIds = await Resource.distinct("_id");

    // Find exchanges with resources that don't exist
    const orphanedExchanges = await Exchange.find({
      resource: { $nin: existingResourceIds },
    });

    if (orphanedExchanges.length > 0) {
      const result = await Exchange.deleteMany({
        resource: { $nin: existingResourceIds },
      });
      console.log(`✅ Cleaned up ${result.deletedCount} orphaned exchanges`);
    }

    // Also clean up exchanges with soft-deleted resources
    const deletedResources = await Resource.find({
      status: "deleted",
    }).distinct("_id");
    if (deletedResources.length > 0) {
      const result = await Exchange.deleteMany({
        resource: { $in: deletedResources },
      });
      console.log(
        `✅ Cleaned up ${result.deletedCount} exchanges for soft-deleted resources`,
      );
    }
  } catch (error) {
    console.error("Cleanup error:", error);
  }
}

// Run cleanup
cleanupOrphanedExchanges().then(() => process.exit());
