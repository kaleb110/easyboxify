import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken")
import dotenv from "dotenv"
dotenv.config()

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

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err: any, decoded: string) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.userId = decoded.userId; // Extract userId from the token and attach to the request
    next();
  });
};
 /**
 * Generates a secure JWT token with expiration
 * @param payload - The payload to encode in the token
 * @param expiresIn - Token expiration time
 */
export const generateToken = (payload: object, expiresIn: string | number) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });
};

/**
 * Verifies the JWT token
 * @param token - The token to verify
 */
export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};