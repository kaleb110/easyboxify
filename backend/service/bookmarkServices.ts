import { db } from "../db/index";
import { Bookmark, BookmarkTag, Tag } from "../db/schema";
import { eq, inArray } from "drizzle-orm"; // Use inArray for "whereIn" functionality

// Utility to get all columns from the Bookmark table
const allBookmarkColumns = {
  id: Bookmark.id,
  title: Bookmark.title,
  url: Bookmark.url,
  description: Bookmark.description,
  createdAt: Bookmark.createdAt,
  userId: Bookmark.userId,
  folderId: Bookmark.folderId,
};

const allBookmarkTagColumns = {
  bookmarkId: BookmarkTag.bookmarkId,
  tagId: BookmarkTag.tagId,
};

export const getBookmarks = async () => db.select().from(Bookmark);

export const getBookmarkById = async (id: number) =>
  db.select().from(Bookmark).where(eq(Bookmark.id, id)).limit(1);

export const createBookmark = async (bookmarkData: any) =>
  db.insert(Bookmark).values(bookmarkData).returning(allBookmarkColumns);

export const updateBookmark = async (id: number, bookmarkData: any) =>
  db
    .update(Bookmark)
    .set(bookmarkData)
    .where(eq(Bookmark.id, id))
    .returning(allBookmarkColumns);

export const deleteBookmark = async (id: number) =>
  db.delete(Bookmark).where(eq(Bookmark.id, id)).returning(allBookmarkColumns);

// Service to add tags to a bookmark
export const addTagsToBookmark = async (
  bookmarkId: number,
  tagIds: number[]
) => {
  // Ensure bookmarkId exists before proceeding
  const bookmark = await db
    .select()
    .from(Bookmark)
    .where(eq(Bookmark.id, bookmarkId))
    .limit(1);
  if (bookmark.length === 0) {
    throw new Error(`Bookmark with ID ${bookmarkId} not found`);
  }

  // Ensure tagIds exist before proceeding
  const tags = await db.select().from(Tag).where(inArray(Tag.id, tagIds)); // Using inArray for "whereIn" functionality
  if (tags.length !== tagIds.length) {
    throw new Error("One or more tags not found");
  }

  // Insert into BookmarkTag join table
  const bookmarkTags = tagIds.map((tagId) => ({
    bookmarkId,
    tagId,
  }));

  // Insert and return the created entries in BookmarkTag
  return db
    .insert(BookmarkTag)
    .values(bookmarkTags)
    .returning(allBookmarkTagColumns); // Returning the bookmarkId and tagId inserted into the join table
};
