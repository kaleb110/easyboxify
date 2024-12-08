"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBookmark = exports.updateBookmark = exports.createBookmark = exports.getBookmarkById = exports.getBookmarks = void 0;
const index_1 = require("../db/index");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Utility: Columns for returning from queries
const allBookmarkColumns = {
    id: schema_1.Bookmark.id,
    title: schema_1.Bookmark.title,
    url: schema_1.Bookmark.url,
    description: schema_1.Bookmark.description,
    createdAt: schema_1.Bookmark.createdAt,
    userId: schema_1.Bookmark.userId,
    folderId: schema_1.Bookmark.folderId,
};
const parseDate = (dateString) => {
    if (!dateString)
        return undefined;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format: ${dateString}`);
    }
    return date;
};
// Fetch bookmarks with associated tags, sorted by creation date
const getBookmarks = async () => {
    // Fetch bookmarks with their associated tags, ordered by createdAt (descending)
    const bookmarksWithTags = await index_1.db
        .select({
        bookmark: schema_1.Bookmark,
        tag: schema_1.Tag,
    })
        .from(schema_1.Bookmark)
        .leftJoin(schema_1.BookmarkTag, (0, drizzle_orm_1.eq)(schema_1.Bookmark.id, schema_1.BookmarkTag.bookmarkId))
        .leftJoin(schema_1.Tag, (0, drizzle_orm_1.eq)(schema_1.BookmarkTag.tagId, schema_1.Tag.id))
        .orderBy(schema_1.Bookmark.createdAt);
    // Organize bookmarks and their tags
    const bookmarksMap = new Map();
    for (const { bookmark, tag } of bookmarksWithTags) {
        if (!bookmarksMap.has(bookmark.id)) {
            bookmarksMap.set(bookmark.id, { ...bookmark, tags: [] });
        }
        if (tag) {
            bookmarksMap.get(bookmark.id).tags.push(tag);
        }
    }
    // Convert map to array
    return Array.from(bookmarksMap.values());
};
exports.getBookmarks = getBookmarks;
const getBookmarkById = async (id) => {
    const result = await index_1.db
        .select({
        bookmark: schema_1.Bookmark,
        tag: schema_1.Tag,
    })
        .from(schema_1.Bookmark)
        .leftJoin(schema_1.BookmarkTag, (0, drizzle_orm_1.eq)(schema_1.Bookmark.id, schema_1.BookmarkTag.bookmarkId))
        .leftJoin(schema_1.Tag, (0, drizzle_orm_1.eq)(schema_1.BookmarkTag.tagId, schema_1.Tag.id))
        .where((0, drizzle_orm_1.eq)(schema_1.Bookmark.id, id))
        .limit(1);
    if (result.length === 0)
        return null;
    // Extract bookmark and associated tags
    const bookmark = result[0].bookmark;
    const tags = result.map(({ tag }) => tag).filter((tag) => tag !== null);
    return { ...bookmark, tags };
};
exports.getBookmarkById = getBookmarkById;
// Updated createBookmark function to handle the tags sent from the frontend
const createBookmark = async (bookmarkData) => {
    const { tags, ...restBookmarkData } = bookmarkData;
    // Parse timestamp fields
    const bookmarkWithTimestamp = {
        ...restBookmarkData,
        createdAt: parseDate(bookmarkData.createdAt) || new Date(), // Default to current date if not provided
    };
    // Step 1: Create the bookmark without tags first
    const [createdBookmark] = await index_1.db
        .insert(schema_1.Bookmark)
        .values(bookmarkWithTimestamp)
        .returning(allBookmarkColumns);
    // Step 2: Associate tags if provided
    if (tags && tags.length) {
        const validTags = await index_1.db.select().from(schema_1.Tag).where((0, drizzle_orm_1.inArray)(schema_1.Tag.id, tags));
        if (validTags.length === tags.length) {
            // Add tag associations to BookmarkTag join table
            const bookmarkTags = tags.map((tagId) => ({
                bookmarkId: createdBookmark.id,
                tagId,
            }));
            await index_1.db.insert(schema_1.BookmarkTag).values(bookmarkTags);
        }
        else {
            throw new Error("One or more tags not found");
        }
    }
    // Fetch the created bookmark with associated tags for confirmation
    return await (0, exports.getBookmarkById)(createdBookmark.id);
};
exports.createBookmark = createBookmark;
const updateBookmark = async (id, bookmarkData) => {
    const { tags, ...restBookmarkData } = bookmarkData;
    // Parse timestamp fields
    const bookmarkWithTimestamp = {
        ...restBookmarkData,
        createdAt: parseDate(bookmarkData.createdAt) || new Date(), // Default to current date if not provided
    };
    // Step 1: Update the bookmark data without tags
    const [updatedBookmark] = await index_1.db
        .update(schema_1.Bookmark)
        .set(bookmarkWithTimestamp)
        .where((0, drizzle_orm_1.eq)(schema_1.Bookmark.id, id))
        .returning(allBookmarkColumns);
    // Step 2: Update associated tags if provided
    if (tags && tags.length) {
        // Remove existing tags for the bookmark
        await index_1.db.delete(schema_1.BookmarkTag).where((0, drizzle_orm_1.eq)(schema_1.BookmarkTag.bookmarkId, id));
        // Re-associate tags
        const bookmarkTags = tags.map((tagId) => ({
            bookmarkId: updatedBookmark.id,
            tagId,
        }));
        await index_1.db.insert(schema_1.BookmarkTag).values(bookmarkTags);
    }
    // Fetch the updated bookmark with associated tags
    return await (0, exports.getBookmarkById)(updatedBookmark.id);
};
exports.updateBookmark = updateBookmark;
const deleteBookmark = async (id) => {
    // Delete associated tags first
    await index_1.db.delete(schema_1.BookmarkTag).where((0, drizzle_orm_1.eq)(schema_1.BookmarkTag.bookmarkId, id));
    // Delete the bookmark
    return index_1.db
        .delete(schema_1.Bookmark)
        .where((0, drizzle_orm_1.eq)(schema_1.Bookmark.id, id))
        .returning(allBookmarkColumns);
};
exports.deleteBookmark = deleteBookmark;
