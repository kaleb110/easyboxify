import { db } from "../db/index";
import { Folder } from "../db/schema";
import { eq } from "drizzle-orm";
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

export const deleteFolder = async (id: number) =>
  db.delete(Folder).where(eq(Folder.id, id)).returning(allFolderColumns);
