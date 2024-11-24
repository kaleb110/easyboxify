import { db } from "../db/index";
import { Folder, Bookmark, BookmarkTag } from "../db/schema";
import { eq, inArray } from "drizzle-orm";
// Utility to get all columns from the Folder table
const allFolderColumns = {
  id: Folder.id,
  name: Folder.name,
  userId: Folder.userId,
};

export const getFolders = async () => db.select().from(Folder);

export const getFolderById = async (id: number) =>
  db.select().from(Folder).where(eq(Folder.id, id)).limit(1);

export const createFolder = async (folderData: any) =>
  db.insert(Folder).values(folderData).returning(allFolderColumns);

export const updateFolder = async (id: number, folderData: any) =>
  db
    .update(Folder)
    .set(folderData)
    .where(eq(Folder.id, id))
    .returning(allFolderColumns);

// Delete bookmarks associated with a folder
export const deleteBookmarksByFolderId = async (folderId: number) => {
  // Delete associated tags for bookmarks in the folder
  await db.delete(BookmarkTag)
    .where(inArray(BookmarkTag.bookmarkId, 
      db.select({ id: Bookmark.id })
        .from(Bookmark)
        .where(eq(Bookmark.folderId, folderId))
    ));

  // Delete bookmarks in the folder
  await db.delete(Bookmark)
    .where(eq(Bookmark.folderId, folderId));
};

// Delete a folder and all its associated bookmarks
export const deleteFolderById = async (folderId: number) => {
  // Delete associated bookmarks first
  await deleteBookmarksByFolderId(folderId);

  // Delete the folder itself
  await db.delete(Folder).where(eq(Folder.id, folderId));
};
