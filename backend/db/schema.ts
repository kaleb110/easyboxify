import { integer, pgTable, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

// Define the schema for the 'users' table
export const User = pgTable("User", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar().notNull(),
  role: varchar().notNull().default("user"),
  verified: boolean().default(false),
  resetToken: varchar({ length: 255 }), // Make this nullable
  resetTokenExpiry: timestamp(),        // Make this nullable
});
