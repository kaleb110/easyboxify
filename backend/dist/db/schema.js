"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkTagRelations = exports.BookmarkTag = exports.bookmarkRelations = exports.Bookmark = exports.tagRelations = exports.Tag = exports.folderRelations = exports.Folder = exports.userRelations = exports.User = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// Define the schema for the 'users' table
exports.User = (0, pg_core_1.pgTable)("User", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 20 }).notNull().default("John Doe"),
    email: (0, pg_core_1.varchar)({ length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)().notNull(),
    role: (0, pg_core_1.varchar)().notNull().default("user"),
    sortPreference: (0, pg_core_1.varchar)({ length: 10 }).default("nameAZ"),
    layoutPreference: (0, pg_core_1.varchar)({ length: 10 }).default("card"),
    verified: (0, pg_core_1.boolean)().default(false),
    resetToken: (0, pg_core_1.varchar)({ length: 255 }),
    resetTokenExpiry: (0, pg_core_1.timestamp)(),
    plan: (0, pg_core_1.varchar)({ length: 10 }).notNull().default("free"),
    stripeCustomerId: (0, pg_core_1.varchar)({ length: 255 }),
    subscriptionId: (0, pg_core_1.varchar)({ length: 255 }),
    subscriptionStatus: (0, pg_core_1.varchar)({ length: 25 }),
    lastPaymentStatus: (0, pg_core_1.varchar)({ length: 25 }),
    canceledAt: (0, pg_core_1.timestamp)(),
});
// Define the relationship for the 'User' table
exports.userRelations = (0, drizzle_orm_1.relations)(exports.User, ({ many }) => ({
    folders: many(exports.Folder), // A user can have many folders
    tags: many(exports.Tag), // A user can have many tags
    bookmarks: many(exports.Bookmark), // A user can have many bookmarks
}));
// Folder Table
exports.Folder = (0, pg_core_1.pgTable)("Folder", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 100 }).notNull(),
    userId: (0, pg_core_1.integer)().notNull(),
});
// Define the relationship for the 'Folder' table
exports.folderRelations = (0, drizzle_orm_1.relations)(exports.Folder, ({ one, many }) => ({
    user: one(exports.User, {
        fields: [exports.Folder.userId],
        references: [exports.User.id],
    }), // Each folder belongs to one user
    bookmarks: many(exports.Bookmark), // A folder can have many bookmarks
}));
exports.Tag = (0, pg_core_1.pgTable)("Tag", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    name: (0, pg_core_1.varchar)({ length: 50 }).notNull(),
    userId: (0, pg_core_1.integer)().notNull(),
});
// Define the relationship for the 'Tag' table
exports.tagRelations = (0, drizzle_orm_1.relations)(exports.Tag, ({ one, many }) => ({
    user: one(exports.User, {
        fields: [exports.Tag.userId],
        references: [exports.User.id],
    }), // Each tag belongs to one user
    bookmarks: many(exports.BookmarkTag), // A tag can be associated with many bookmarks through the BookmarkTag join table
}));
// Bookmarks table schema
exports.Bookmark = (0, pg_core_1.pgTable)("Bookmark", {
    id: (0, pg_core_1.integer)().primaryKey().generatedAlwaysAsIdentity(),
    title: (0, pg_core_1.varchar)({ length: 255 }).notNull(),
    url: (0, pg_core_1.varchar)({ length: 500 }).notNull(),
    description: (0, pg_core_1.varchar)({ length: 1000 }).default(""),
    createdAt: (0, pg_core_1.timestamp)().defaultNow(),
    userId: (0, pg_core_1.integer)().notNull(),
    folderId: (0, pg_core_1.integer)(),
});
// Define the relationship for the 'Bookmark' table
exports.bookmarkRelations = (0, drizzle_orm_1.relations)(exports.Bookmark, ({ one, many }) => ({
    user: one(exports.User, {
        fields: [exports.Bookmark.userId],
        references: [exports.User.id],
    }), // Each bookmark belongs to one user
    folder: one(exports.Folder, {
        fields: [exports.Bookmark.folderId],
        references: [exports.Folder.id],
    }), // Each bookmark may belong to a folder
    tags: many(exports.BookmarkTag), // A bookmark can have many tags through the BookmarkTag join table
}));
exports.BookmarkTag = (0, pg_core_1.pgTable)("BookmarkTag", {
    bookmarkId: (0, pg_core_1.integer)().notNull(),
    tagId: (0, pg_core_1.integer)().notNull(),
});
// Define the relationship for the 'BookmarkTag' join table
exports.bookmarkTagRelations = (0, drizzle_orm_1.relations)(exports.BookmarkTag, ({ one }) => ({
    bookmark: one(exports.Bookmark, {
        fields: [exports.BookmarkTag.bookmarkId],
        references: [exports.Bookmark.id],
    }), // Each entry links to one bookmark
    tag: one(exports.Tag, {
        fields: [exports.BookmarkTag.tagId],
        references: [exports.Tag.id],
    }), // Each entry links to one tag
}));
