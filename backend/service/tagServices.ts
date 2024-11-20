import { db } from "../db/index";
import { Tag } from "../db/schema";
import { eq } from "drizzle-orm";

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

export const deleteTag = async (id: number) =>
  db.delete(Tag).where(eq(Tag.id, id)).returning(allTagColumns);
