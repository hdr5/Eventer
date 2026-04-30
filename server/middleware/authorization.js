export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(" user role =", req.user.role, "allowedRoles =", allowedRoles);
    const userRole = req.user.role.toLowerCase();
    const roles = allowedRoles.map(r => r.toLowerCase());

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};