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
const sendEmail_1 = require("./sendEmail");
const registerHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res
                .status(400)
                .send("Name, Email, password, and role are required");
        }
        const existingUserResult = yield db_1.db
            .select()
            .from(schema_1.User)
            .where((0, drizzle_orm_1.eq)(schema_1.User.email, email))
            .limit(1);
        if (existingUserResult.length) {
            return res.status(400).send("User already exists");
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const [user] = yield db_1.db
            .insert(schema_1.User)
            .values({ name, email, password: hashedPassword, role })
            .returning();
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        const verificationLink = `${process.env.BASE_URL}/auth/login?token=${token}`;
        yield (0, sendEmail_1.sendVerificationEmail)(email, verificationLink);
        res.send("Registration successful. Check your email to verify your account.");
    }
    catch (error) {
        console.error("Error during registration:", error.message);
        res.status(500).send("An error occurred during registration");
    }
});
exports.default = registerHandler;
