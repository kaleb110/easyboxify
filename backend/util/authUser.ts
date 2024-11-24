const jwt = require("jsonwebtoken")
import { Request, Response, NextFunction } from "express";

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Authorization: Bearer <token>"

  if (!token) {
    return res.status(401).send("No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
    };
    req.userId = decoded.userId; // Attach userId to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
};

export default authenticateUser;
