// refreshTokenHandler.ts
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
dotenv.config();

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

export const refreshTokenHandler = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken; // Retrieve from HttpOnly cookie

  if (!refreshToken) {
    return res.status(401).send("Refresh token not provided");
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      JWT_SECRET_KEY,
      { expiresIn: TOKEN_EXPIRATION }
    );

    // Generate a new refresh token with a fresh payload and expiration
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role }, // Fresh payload without exp property
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // Specify the expiration for the refresh token
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Send the new access token to the client
    res.send({ accessToken: newAccessToken });
  } catch (error) {
    console.log(error);
    return res.status(403).send("Invalid or expired refresh token");
  }
};

