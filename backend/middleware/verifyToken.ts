import dotenv from "dotenv";
const jwt = require("jsonwebtoken");
import { Request, Response } from "express";
dotenv.config();
// Middleware to verify the token and extract the userId
const verifyToken = (req: Request, res: Response, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.userId = decoded.userId; // Extract userId from the token and attach to the request
    next();
  });
};

export default verifyToken;
