const { USER_ROLES, PERMISSIONS } = require("../config/constants");

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (
      req.user.role !== USER_ROLES.ADMIN &&
      req.user.role !== USER_ROLES.SUPER_ADMIN
    ) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Check if user is super admin
exports.isSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== USER_ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Super admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Super admin middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Check if user has specific permission
exports.hasPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (req.user.role === USER_ROLES.SUPER_ADMIN) {
        return next();
      }

      if (!req.user.hasPermission(permission)) {
        return res.status(403).json({
          success: false,
          message: `Permission '${permission}' required`,
        });
      }

      next();
    } catch (error) {
      console.error("Permission middleware error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
};

// Check if user is moderator or higher
exports.isModerator = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const moderatorRoles = [
      USER_ROLES.MODERATOR,
      USER_ROLES.ADMIN,
      USER_ROLES.SUPER_ADMIN,
    ];
    if (!moderatorRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Moderator access required",
      });
    }

    next();
  } catch (error) {
    console.error("Moderator middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
