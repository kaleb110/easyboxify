import { Request, Response, NextFunction } from "express";

export const checkRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).send("Access denied. Insufficient permissions.");
    }
    next();
  };
};
