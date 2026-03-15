export const authorizeRoles = (...allowedRoles) => {
    console.log('________ allo ', allowedRoles);
    
 return (req, res, next) => {
    console.log("DEBUG: req.user =", req.user);

    if (!req.user || !req.user.role) {
        console.log("DEBUG: Access denied, no user or no role");
        return res.status(403).json({ message: "Access denied" });
    }

    if (!allowedRoles.includes(req.user.role)) {
        console.log("DEBUG: Not authorized, user role =", req.user.role, "allowedRoles =", allowedRoles);
        return res.status(403).json({ message: "Not authorized" });
    }

    console.log("DEBUG: Authorization passed for role =", req.user.role);
    next();
};

}; 
