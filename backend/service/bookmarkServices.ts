import { db } from "../db/index";
import { Bookmark, BookmarkTag, Tag } from "../db/schema";
import { eq, inArray } from "drizzle-orm";

// Utility: Columns for returning from queries
const allBookmarkColumns = {
  id: Bookmark.id,
  title: Bookmark.title,
  url: Bookmark.url,
  description: Bookmark.description,
  createdAt: Bookmark.createdAt,
  userId: Bookmark.userId,
  folderId: Bookmark.folderId,
};
// Fetch bookmarks with associated tags, sorted by creation date
export const getBookmarks = async () => {
  // Fetch bookmarks with their associated tags, ordered by createdAt (descending)
  const bookmarksWithTags = await db
    .select({
      bookmark: Bookmark,
      tag: Tag,
    })
    .from(Bookmark)
    .leftJoin(BookmarkTag, eq(Bookmark.id, BookmarkTag.bookmarkId))
    .leftJoin(Tag, eq(BookmarkTag.tagId, Tag.id))
    .orderBy(Bookmark.createdAt);

  // Organize bookmarks and their tags
  const bookmarksMap = new Map<number, any>();

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

export const getBookmarkById = async (id: number) => {
  const result = await db
    .select()
    .from(Bookmark)
    .leftJoin(BookmarkTag, eq(Bookmark.id, BookmarkTag.bookmarkId))
    .leftJoin(Tag, eq(BookmarkTag.tagId, Tag.id))
    .where(eq(Bookmark.id, id))
    .limit(1);

  if (result.length === 0) return null;

  // Extract bookmark and associated tags
  const bookmark = result[0].bookmark;
  const tags = result.map(({ tag }) => tag).filter((tag) => tag !== null);
  return { ...bookmark, tags };
};

// Updated createBookmark function to handle the tags sent from the frontend
export const createBookmark = async (bookmarkData: any) => {
  const { tags, ...restBookmarkData } = bookmarkData;

  // Step 1: Create the bookmark without tags first
  const [createdBookmark] = await db
    .insert(Bookmark)
    .values(restBookmarkData)
    .returning(allBookmarkColumns);

  // Step 2: Associate tags if provided
  if (tags && tags.length) {
    const validTags = await db.select().from(Tag).where(inArray(Tag.id, tags));

    if (validTags.length === tags.length) {
      // Add tag associations to BookmarkTag join table
      const bookmarkTags = tags.map((tagId: number) => ({
        bookmarkId: createdBookmark.id,
        tagId,
      }));
      await db.insert(BookmarkTag).values(bookmarkTags);
    } else {
      throw new Error("One or more tags not found");
    }
  }

  // Fetch the created bookmark with associated tags for confirmation
  return await getBookmarkById(createdBookmark.id);
};

export const updateBookmark = async (id: number, bookmarkData: any) => {
  const { tags, ...restBookmarkData } = bookmarkData;

  // Step 1: Update the bookmark data without tags
  const [updatedBookmark] = await db
    .update(Bookmark)
    .set(restBookmarkData)
    .where(eq(Bookmark.id, id))
    .returning(allBookmarkColumns);

  // Step 2: Update associated tags if provided
  if (tags && tags.length) {
    // Remove existing tags for the bookmark
    await db.delete(BookmarkTag).where(eq(BookmarkTag.bookmarkId, id));

    // Re-associate tags
    const bookmarkTags = tags.map((tagId: number) => ({
      bookmarkId: updatedBookmark.id,
      tagId,
    }));
    await db.insert(BookmarkTag).values(bookmarkTags);
  }

  // Fetch the updated bookmark with associated tags
  return await getBookmarkById(updatedBookmark.id);
};

export const deleteBookmark = async (id: number) => {
  // Delete associated tags first
  await db.delete(BookmarkTag).where(eq(BookmarkTag.bookmarkId, id));

  // Delete the bookmark
  return db
    .delete(Bookmark)
    .where(eq(Bookmark.id, id))
    .returning(allBookmarkColumns);
};
