"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceBookmarkLimit = exports.enforceTagLimit = exports.enforceFolderLimit = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Middleware to enforce folder limit for free users
const enforceFolderLimit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = req.userId; // Assuming userId is extracted from the token
    const userResult = yield db_1.db
        .select()
        .from(schema_1.User)
        .where((0, drizzle_orm_1.eq)(schema_1.User.id, userId))
        .limit(1);
    const user = userResult[0];
    if (user.plan === "free") {
        const folderCountResult = yield db_1.db
            .select({ count: (0, drizzle_orm_1.count)() }) // Use count() to get the number of folders
            .from(schema_1.Folder)
            .where((0, drizzle_orm_1.eq)(schema_1.Folder.userId, userId));
        const folderCount = (_b = (_a = folderCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
        console.log(`Folder count for user ${userId}: ${folderCount}`);
        if (folderCount >= 3) {
            return res.status(403).json({
                error: "Free plan limit reached: Maximum of 3 folders allowed.",
            });
        }
    }
    next();
});
exports.enforceFolderLimit = enforceFolderLimit;
// Middleware to enforce tag limit for free users
const enforceTagLimit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = req.userId; // Assuming userId is extracted from the token
    const userResult = yield db_1.db
        .select()
        .from(schema_1.User)
        .where((0, drizzle_orm_1.eq)(schema_1.User.id, userId))
        .limit(1);
    const user = userResult[0];
    if (user.plan === "free") {
        const tagCountResult = yield db_1.db
            .select({ count: (0, drizzle_orm_1.count)() }) // Use count() to get the number of tags
            .from(schema_1.Tag)
            .where((0, drizzle_orm_1.eq)(schema_1.Tag.userId, userId));
        const tagCount = (_b = (_a = tagCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
        console.log(`Tag count for user ${userId}: ${tagCount}`);
        if (tagCount >= 2) {
            return res.status(403).json({
                error: "Free plan limit reached: Maximum of 3 tags allowed.",
            });
        }
    }
    next();
});
exports.enforceTagLimit = enforceTagLimit;
// Middleware to enforce bookmark limit for free users
const enforceBookmarkLimit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = req.userId; // Assuming userId is extracted from the token
    const userResult = yield db_1.db
        .select()
        .from(schema_1.User)
        .where((0, drizzle_orm_1.eq)(schema_1.User.id, userId))
        .limit(1);
    const user = userResult[0];
    if (user.plan === "free") {
        const bookmarkCountResult = yield db_1.db
            .select({ count: (0, drizzle_orm_1.count)() }) // Use count() to get the number of bookmarks
            .from(schema_1.Bookmark)
            .where((0, drizzle_orm_1.eq)(schema_1.Bookmark.userId, userId));
        const bookmarkCount = (_b = (_a = bookmarkCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
        console.log(`Bookmark count for user ${userId}: ${bookmarkCount}`);
        if (bookmarkCount >= 100) {
            return res.status(403).json({
                error: "Free plan limit reached: Maximum of 100 bookmarks allowed.",
            });
        }
    }
    next();
});
exports.enforceBookmarkLimit = enforceBookmarkLimit;
