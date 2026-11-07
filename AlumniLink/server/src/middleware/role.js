
/** Restricts a route to one or more roles (FR-AUTH-07). */

export const role = (...roles) => {
  return (req, res, next) => {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check user role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission for this action",
      });
    }

    next();
  };
};
