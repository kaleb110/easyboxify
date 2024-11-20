import { db } from "../db/index";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";

// Utility to get all columns from the User table
const allUserColumns = {
  id: User.id,
  name: User.name,
  email: User.email,
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

export const deleteUser = async (id: number) =>
  db.delete(User).where(eq(User.id, id)).returning(allUserColumns);
