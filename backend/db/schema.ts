import {
  integer,
  pgTable,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
// Define the schema for the 'users' table
export const User = pgTable("User", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 20 }).notNull().default("John Doe"),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar().notNull(),
  role: varchar().notNull().default("user"),
  verified: boolean().default(false),
  resetToken: varchar({ length: 255 }),
  resetTokenExpiry: timestamp(),
  plan: varchar({ length: 10 }).notNull().default("free"),
  stripeCustomerId: varchar({ length: 255 }),
  subscriptionId: varchar({ length: 255 }),
  subscriptionStatus: varchar({ length: 25 }),
  lastPaymentStatus: varchar({ length: 25 }),
  canceledAt: timestamp(),
});

// Define the relationship for the 'User' table
export const userRelations = relations(User, ({ many }) => ({
  folders: many(Folder), // A user can have many folders
  tags: many(Tag), // A user can have many tags
  bookmarks: many(Bookmark), // A user can have many bookmarks
}));

// Folder Table
export const Folder = pgTable("Folder", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
  userId: integer().notNull(),
});

// Define the relationship for the 'Folder' table
export const folderRelations = relations(Folder, ({ one, many }) => ({
  user: one(User, {
    fields: [Folder.userId],
    references: [User.id],
  }), // Each folder belongs to one user
  bookmarks: many(Bookmark), // A folder can have many bookmarks
}));

export const Tag = pgTable("Tag", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 50 }).notNull(),
  userId: integer().notNull(),
});

// Define the relationship for the 'Tag' table
export const tagRelations = relations(Tag, ({ one, many }) => ({
  user: one(User, {
    fields: [Tag.userId],
    references: [User.id],
  }), // Each tag belongs to one user
  bookmarks: many(BookmarkTag), // A tag can be associated with many bookmarks through the BookmarkTag join table
}));

// Bookmarks table schema
export const Bookmark = pgTable("Bookmark", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  url: varchar({ length: 500 }).notNull(),
  description: varchar({ length: 1000 }).default(""),
  createdAt: timestamp().defaultNow(),
  userId: integer().notNull(),
  folderId: integer(),
});

// Define the relationship for the 'Bookmark' table
export const bookmarkRelations = relations(Bookmark, ({ one, many }) => ({
  user: one(User, {
    fields: [Bookmark.userId],
    references: [User.id],
  }), // Each bookmark belongs to one user
  folder: one(Folder, {
    fields: [Bookmark.folderId],
    references: [Folder.id],
  }), // Each bookmark may belong to a folder
  tags: many(BookmarkTag), // A bookmark can have many tags through the BookmarkTag join table
}));

export const BookmarkTag = pgTable("BookmarkTag", {
  bookmarkId: integer().notNull(),
  tagId: integer().notNull(),
});

// Define the relationship for the 'BookmarkTag' join table
export const bookmarkTagRelations = relations(BookmarkTag, ({ one }) => ({
  bookmark: one(Bookmark, {
    fields: [BookmarkTag.bookmarkId],
    references: [Bookmark.id],
  }), // Each entry links to one bookmark
  tag: one(Tag, {
    fields: [BookmarkTag.tagId],
    references: [Tag.id],
  }), // Each entry links to one tag
}));
