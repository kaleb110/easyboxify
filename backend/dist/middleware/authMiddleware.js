"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.generateToken = exports.verifyToken = exports.authenticate = void 0;
const jwt = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Middleware to verify JWT and extract user information
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).send("Access Denied: No Token Provided");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId; // Attach user information to the request object
        next();
    }
    catch (err) {
        res.status(400).send("Invalid Token");
    }
};
exports.authenticate = authenticate;
const verifyToken = (req, res, next) => {
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
exports.verifyToken = verifyToken;
/**
* Generates a secure JWT token with expiration
* @param payload - The payload to encode in the token
* @param expiresIn - Token expiration time
*/
const generateToken = (payload, expiresIn) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn });
};
exports.generateToken = generateToken;
/**
 * Verifies the JWT token
 * @param token - The token to verify
 */
const verifyJwtToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
exports.verifyJwtToken = verifyJwtToken;
