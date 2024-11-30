import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
import { db } from "../../db";
import { User } from "../../db/schema";
import { eq } from "drizzle-orm";

const verifyEmailHandler = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET_KEY);
    const userResult = await db
      .select()
      .from(User)
      .where(eq(User.id, decoded.userId))
      .limit(1);

    const user = userResult[0];
    if (!user) return res.status(400).send("Invalid link");

    await db
      .update(User)
      .set({ verified: true })
      .where(eq(User.id, decoded.userId));
    res.send("Email verified successfully");
  } catch (error) {
    res.status(400).send("Invalid or expired token");
  }
};

export default verifyEmailHandler;
