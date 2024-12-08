"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceBookmarkLimit = exports.enforceTagLimit = exports.enforceFolderLimit = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Middleware to enforce folder limit for free users
const enforceFolderLimit = async (req, res, next) => {
    const userId = Number(req.userId); // Assuming userId is extracted from the token
    const userResult = await db_1.db
        .select()
        .from(schema_1.User)
        .where((0, drizzle_orm_1.eq)(schema_1.User.id, userId))
        .limit(1);
    const user = userResult[0];
    if (user.plan === "free") {
        const folderCountResult = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() }) // Use count() to get the number of folders
            .from(schema_1.Folder)
            .where((0, drizzle_orm_1.eq)(schema_1.Folder.userId, userId));
        const folderCount = folderCountResult[0]?.count ?? 0;
        console.log(`Folder count for user ${userId}: ${folderCount}`);
        if (folderCount >= 3) {
            return res.status(403).json({
                error: "Free plan limit reached: Maximum of 3 folders allowed.",
            });
        }
    }
    next();
};
exports.enforceFolderLimit = enforceFolderLimit;
// Middleware to enforce tag limit for free users
const enforceTagLimit = async (req, res, next) => {
    const userId = Number(req.userId); // Assuming userId is extracted from the token
    const userResult = await db_1.db
        .select()
        .from(schema_1.User)
        .where((0, drizzle_orm_1.eq)(schema_1.User.id, userId))
        .limit(1);
    const user = userResult[0];
    if (user.plan === "free") {
        const tagCountResult = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() }) // Use count() to get the number of tags
            .from(schema_1.Tag)
            .where((0, drizzle_orm_1.eq)(schema_1.Tag.userId, userId));
        const tagCount = tagCountResult[0]?.count ?? 0;
        console.log(`Tag count for user ${userId}: ${tagCount}`);
        if (tagCount >= 2) {
            return res.status(403).json({
                error: "Free plan limit reached: Maximum of 3 tags allowed.",
            });
        }
    }
    next();
};
exports.enforceTagLimit = enforceTagLimit;
// Middleware to enforce bookmark limit for free users
const enforceBookmarkLimit = async (req, res, next) => {
    const userId = Number(req.userId); // Assuming userId is extracted from the token
    const userResult = await db_1.db
        .select()
        .from(schema_1.User)
        .where((0, drizzle_orm_1.eq)(schema_1.User.id, userId))
        .limit(1);
    const user = userResult[0];
    if (user.plan === "free") {
        const bookmarkCountResult = await db_1.db
            .select({ count: (0, drizzle_orm_1.count)() }) // Use count() to get the number of bookmarks
            .from(schema_1.Bookmark)
            .where((0, drizzle_orm_1.eq)(schema_1.Bookmark.userId, userId));
        const bookmarkCount = bookmarkCountResult[0]?.count ?? 0;
        console.log(`Bookmark count for user ${userId}: ${bookmarkCount}`);
        if (bookmarkCount >= 100) {
            return res.status(403).json({
                error: "Free plan limit reached: Maximum of 100 bookmarks allowed.",
            });
        }
    }
    next();
};
exports.enforceBookmarkLimit = enforceBookmarkLimit;
