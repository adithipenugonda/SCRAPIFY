const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check User Exists
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Access denied. No user found.",
        });
      }

      // Check Role
      if (
        !allowedRoles.includes(req.user.role)
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied. Insufficient permissions.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

module.exports = roleMiddleware;