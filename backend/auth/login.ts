import { Request, Response } from "express";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import { db } from "../db";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const TOKEN_EXPIRATION = "1h"

const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userResult = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);

    const user = userResult[0];
    if (!user || !user.verified) {
      return res.status(400).send("Invalid email or email not verified");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password");

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET_KEY,
      { expiresIn: TOKEN_EXPIRATION }
    );

    res.send({ token });
  } catch (error) {
    res.status(500).send("An error occurred during login");
  }
};

export default loginHandler;
