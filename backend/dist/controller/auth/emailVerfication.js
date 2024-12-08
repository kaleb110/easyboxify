"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const verifyEmailHandler = async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userResult = await db_1.db
            .select()
            .from(schema_1.User)
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, decoded.userId))
            .limit(1);
        const user = userResult[0];
        if (!user)
            return res.status(400).send("Invalid link");
        await db_1.db
            .update(schema_1.User)
            .set({ verified: true })
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, decoded.userId));
        res.send("Email verified successfully");
    }
    catch (error) {
        res.status(400).send("Invalid or expired token");
    }
};
exports.default = verifyEmailHandler;
