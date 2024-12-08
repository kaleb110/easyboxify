"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordHandler = exports.requestPasswordResetHandler = void 0;
const authMiddleware_1 = require("../../middleware/authMiddleware");
const bcrypt = require("bcryptjs");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const sendEmail_1 = require("./sendEmail");
// Request password reset handler
const requestPasswordResetHandler = async (req, res) => {
    try {
        const { email } = req.body;
        const userResult = await db_1.db
            .select()
            .from(schema_1.User)
            .where((0, drizzle_orm_1.eq)(schema_1.User.email, email))
            .limit(1);
        const user = userResult[0];
        if (!user)
            return res.status(400).send("User not found");
        // Generate reset token using utility function
        const token = (0, authMiddleware_1.generateToken)({ userId: user.id }, "20m");
        // Update the user record with the reset token and its expiry
        await db_1.db
            .update(schema_1.User)
            .set({
            resetToken: token,
            resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, user.id));
        // Send the password reset email with the generated link
        const resetLink = `${process.env.BASE_URL}/auth/reset?token=${token}`;
        await (0, sendEmail_1.sendPasswordResetEmail)(email, resetLink);
        res.send("Password reset email sent. Check your email for instructions.");
    }
    catch (error) {
        console.error("Error during password reset request:", error);
        res.status(500).send("An error occurred while requesting password reset.");
    }
};
exports.requestPasswordResetHandler = requestPasswordResetHandler;
// Reset password handler
const resetPasswordHandler = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        // Verify the token using the utility function
        const decoded = (0, authMiddleware_1.verifyJwtToken)(token);
        const userResult = await db_1.db
            .select()
            .from(schema_1.User)
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, decoded.userId))
            .limit(1);
        const user = userResult[0];
        // Validate the token and expiration time
        if (!user ||
            user.resetToken !== token ||
            !user.resetTokenExpiry ||
            new Date() > new Date(user.resetTokenExpiry)) {
            return res.status(400).send("Invalid or expired reset token");
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update the user's password and clear the reset token
        await db_1.db
            .update(schema_1.User)
            .set({
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, user.id));
        res.send("Password reset successful. You can now log in with your new password.");
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(400).send("Invalid or expired reset token");
    }
};
exports.resetPasswordHandler = resetPasswordHandler;
