import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

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
export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
