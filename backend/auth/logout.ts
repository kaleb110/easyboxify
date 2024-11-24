// logoutHandler.ts
import { Request, Response } from "express";

export const logoutHandler = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", { path: "/" }); // Clear the refresh token cookie
  return res.status(200).json({ message: "Logged out successfully" });
};
