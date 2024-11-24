import { db } from "../db/index";
import { Bookmark, BookmarkTag, Tag } from "../db/schema";
import { eq, inArray } from "drizzle-orm";

// Utility to get all columns from a table if needed
const allTagColumns = {
  id: Tag.id,
  name: Tag.name,
  userId: Tag.userId,
};

export const getTags = async () => db.select().from(Tag);

export const getTagById = async (id: number) =>
  db.select().from(Tag).where(eq(Tag.id, id)).limit(1);

export const createTag = async (tagData: any) =>
  db.insert(Tag).values(tagData).returning(allTagColumns);

export const updateTag = async (id: number, tagData: any) =>
  db.update(Tag).set(tagData).where(eq(Tag.id, id)).returning(allTagColumns);

// Delete all bookmarks associated with a tag
export const deleteBookmarksByTagId = async (tagId: number) => {
  // Delete the tag associations first
  await db.delete(BookmarkTag).where(eq(BookmarkTag.tagId, tagId));

  // Optionally delete the bookmarks associated with this tag (if needed)
  // This is optional based on your requirement: whether you want to remove the bookmarks or keep them
  await db
    .delete(Bookmark)
    .where(
      inArray(
        Bookmark.id,
        db
          .select({ bookmarkId: BookmarkTag.bookmarkId })
          .from(BookmarkTag)
          .where(eq(BookmarkTag.tagId, tagId))
      )
    );
};

// Delete a tag by its ID
export const deleteTagById = async (tagId: number) => {
  // Delete bookmarks associated with the tag first
  await deleteBookmarksByTagId(tagId);

  // Delete the tag
  await db.delete(Tag).where(eq(Tag.id, tagId));
};
