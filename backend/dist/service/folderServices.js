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
exports.deleteFolderById = exports.deleteBookmarksByFolderId = exports.updateFolder = exports.createFolder = exports.getFolderById = exports.getFolders = void 0;
const index_1 = require("../db/index");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Utility to get all columns from the Folder table
const allFolderColumns = {
    id: schema_1.Folder.id,
    name: schema_1.Folder.name,
    userId: schema_1.Folder.userId,
};
const getFolders = () => __awaiter(void 0, void 0, void 0, function* () { return index_1.db.select().from(schema_1.Folder); });
exports.getFolders = getFolders;
const getFolderById = (id) => __awaiter(void 0, void 0, void 0, function* () { return index_1.db.select().from(schema_1.Folder).where((0, drizzle_orm_1.eq)(schema_1.Folder.id, id)).limit(1); });
exports.getFolderById = getFolderById;
const createFolder = (folderData) => __awaiter(void 0, void 0, void 0, function* () { return index_1.db.insert(schema_1.Folder).values(folderData).returning(allFolderColumns); });
exports.createFolder = createFolder;
const updateFolder = (id, folderData) => __awaiter(void 0, void 0, void 0, function* () {
    return index_1.db
        .update(schema_1.Folder)
        .set(folderData)
        .where((0, drizzle_orm_1.eq)(schema_1.Folder.id, id))
        .returning(allFolderColumns);
});
exports.updateFolder = updateFolder;
// Delete bookmarks associated with a folder
const deleteBookmarksByFolderId = (folderId) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete associated tags for bookmarks in the folder
    yield index_1.db.delete(schema_1.BookmarkTag)
        .where((0, drizzle_orm_1.inArray)(schema_1.BookmarkTag.bookmarkId, index_1.db.select({ id: schema_1.Bookmark.id })
        .from(schema_1.Bookmark)
        .where((0, drizzle_orm_1.eq)(schema_1.Bookmark.folderId, folderId))));
    // Delete bookmarks in the folder
    yield index_1.db.delete(schema_1.Bookmark)
        .where((0, drizzle_orm_1.eq)(schema_1.Bookmark.folderId, folderId));
});
exports.deleteBookmarksByFolderId = deleteBookmarksByFolderId;
// Delete a folder and all its associated bookmarks
const deleteFolderById = (folderId) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete associated bookmarks first
    yield (0, exports.deleteBookmarksByFolderId)(folderId);
    // Delete the folder itself
    yield index_1.db.delete(schema_1.Folder).where((0, drizzle_orm_1.eq)(schema_1.Folder.id, folderId));
});
exports.deleteFolderById = deleteFolderById;
