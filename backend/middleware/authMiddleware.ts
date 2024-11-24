import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken")

// Middleware to verify JWT and extract user information
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied: No Token Provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId; // Attach user information to the request object
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

// Middleware to check user role
export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Access Denied: Insufficient Role");
    }
    next();
  };
};

// Middleware to check user permissions
export const authorizePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = getUserPermissions(req.user.role);
    if (!userPermissions.includes(permission)) {
      return res.status(403).send("Access Denied: Insufficient Permissions");
    }
    next();
  };
};

// Sample function to get permissions based on role
function getUserPermissions(role: string): string[] {
  const rolePermissions = {
    admin: ["view_dashboard", "manage_users", "create_post", "delete_post"],
    user: ["view_dashboard", "create_post"],
    editor: ["view_dashboard", "edit_post", "create_post"],
  };
  return rolePermissions[role] || [];
}
