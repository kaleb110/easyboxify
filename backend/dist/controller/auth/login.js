"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const ACCESS_TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN;
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;
const loginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userResult = yield db_1.db
            .select()
            .from(schema_1.User)
            .where((0, drizzle_orm_1.eq)(schema_1.User.email, email))
            .limit(1);
        const user = userResult[0];
        if (!user || !user.verified) {
            return res.status(400).send("Invalid email or email not verified");
        }
        const validPassword = yield bcrypt.compare(password, user.password);
        if (!validPassword)
            return res.status(400).send("Invalid password");
        // generate access token
        const accessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRATION });
        // generate refresh token
        const refreshToken = jwt.sign({ userId: user.id, role: user.role }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
        // Store refresh token in HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.send({ token: accessToken });
    }
    catch (error) {
        res.status(500).json({ message: "An error occurred during login", error });
    }
});
exports.default = loginHandler;
