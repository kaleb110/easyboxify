import { db } from "../db/index";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";
const bcrypt = require("bcryptjs");

// Utility to get all columns from the User table
const allUserColumns = {
  id: User.id,
  name: User.name,
  email: User.email,
  password: User.password,
  role: User.role,
  verified: User.verified,
  resetToken: User.resetToken,
  resetTokenExpiry: User.resetTokenExpiry,
};

export const getUsers = async () => db.select().from(User);

export const getUserById = async (id: number) =>
  db.select().from(User).where(eq(User.id, id)).limit(1);

export const createUser = async (userData: any) =>
  db.insert(User).values(userData).returning(allUserColumns);

export const updateUser = async (id: number, userData: any) =>
  db
    .update(User)
    .set(userData)
    .where(eq(User.id, id))
    .returning(allUserColumns);

export const changeUserPassword = async (id: number, data: any) => {
  const { currentPassword, newPassword } = data;
  const userResult = await db
    .select()
    .from(User)
    .where(eq(User.id, id))
    .limit(1);
  const user = userResult[0];

  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if (!validPassword) throw new Error("Password is incorrect!");

  // hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // update the database

  return await db
    .update(User)
    .set({ password: hashedPassword })
    .where(eq(User.id, id));
};

export const deleteUser = async (id: number) =>
  db.delete(User).where(eq(User.id, id)).returning(allUserColumns);
