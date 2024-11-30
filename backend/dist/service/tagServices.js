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
exports.deleteTagById = exports.deleteBookmarksByTagId = exports.updateTag = exports.createTag = exports.getTagById = exports.getTags = void 0;
const index_1 = require("../db/index");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Utility to get all columns from a table if needed
const allTagColumns = {
    id: schema_1.Tag.id,
    name: schema_1.Tag.name,
    userId: schema_1.Tag.userId,
};
const getTags = () => __awaiter(void 0, void 0, void 0, function* () { return index_1.db.select().from(schema_1.Tag); });
exports.getTags = getTags;
const getTagById = (id) => __awaiter(void 0, void 0, void 0, function* () { return index_1.db.select().from(schema_1.Tag).where((0, drizzle_orm_1.eq)(schema_1.Tag.id, id)).limit(1); });
exports.getTagById = getTagById;
const createTag = (tagData) => __awaiter(void 0, void 0, void 0, function* () { return index_1.db.insert(schema_1.Tag).values(tagData).returning(allTagColumns); });
exports.createTag = createTag;
const updateTag = (id, tagData) => __awaiter(void 0, void 0, void 0, function* () { return index_1.db.update(schema_1.Tag).set(tagData).where((0, drizzle_orm_1.eq)(schema_1.Tag.id, id)).returning(allTagColumns); });
exports.updateTag = updateTag;
// Delete all bookmarks associated with a tag
const deleteBookmarksByTagId = (tagId) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete the tag associations first
    yield index_1.db.delete(schema_1.BookmarkTag).where((0, drizzle_orm_1.eq)(schema_1.BookmarkTag.tagId, tagId));
    // Optionally delete the bookmarks associated with this tag (if needed)
    // This is optional based on your requirement: whether you want to remove the bookmarks or keep them
    yield index_1.db
        .delete(schema_1.Bookmark)
        .where((0, drizzle_orm_1.inArray)(schema_1.Bookmark.id, index_1.db
        .select({ bookmarkId: schema_1.BookmarkTag.bookmarkId })
        .from(schema_1.BookmarkTag)
        .where((0, drizzle_orm_1.eq)(schema_1.BookmarkTag.tagId, tagId))));
});
exports.deleteBookmarksByTagId = deleteBookmarksByTagId;
// Delete a tag by its ID
const deleteTagById = (tagId) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete bookmarks associated with the tag first
    yield (0, exports.deleteBookmarksByTagId)(tagId);
    // Delete the tag
    yield index_1.db.delete(schema_1.Tag).where((0, drizzle_orm_1.eq)(schema_1.Tag.id, tagId));
});
exports.deleteTagById = deleteTagById;
