import { generateToken, verifyJwtToken } from "../../middleware/authMiddleware";
import { Request, Response } from "express";
const bcrypt = require("bcryptjs");
import { db } from "../../db";
import { User } from "../../db/schema";
import { eq } from "drizzle-orm";
import { sendPasswordResetEmail } from "./sendEmail";

// Request password reset handler
export const requestPasswordResetHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;
    const userResult = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);
    const user = userResult[0];

    if (!user) return res.status(400).send("User not found");

    // Generate reset token using utility function
    const token = generateToken({ userId: user.id }, "20m");

    // Update the user record with the reset token and its expiry
    await db
      .update(User)
      .set({
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
      })
      .where(eq(User.id, user.id));

    // Send the password reset email with the generated link
    const resetLink = `${process.env.BASE_URL}/auth/reset?token=${token}`;
    await sendPasswordResetEmail(email, resetLink);

    res.send("Password reset email sent. Check your email for instructions.");
  } catch (error) {
    console.error("Error during password reset request:", error);
    res.status(500).send("An error occurred while requesting password reset.");
  }
};

// Reset password handler
export const resetPasswordHandler = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token using the utility function
    const decoded: any = verifyJwtToken(token);
    const userResult = await db
      .select()
      .from(User)
      .where(eq(User.id, decoded.userId))
      .limit(1);
    const user = userResult[0];

    // Validate the token and expiration time
    if (
      !user ||
      user.resetToken !== token ||
      !user.resetTokenExpiry ||
      new Date() > new Date(user.resetTokenExpiry)
    ) {
      return res.status(400).send("Invalid or expired reset token");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    await db
      .update(User)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      })
      .where(eq(User.id, user.id));

    res.send(
      "Password reset successful. You can now log in with your new password."
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(400).send("Invalid or expired reset token");
  }
};
