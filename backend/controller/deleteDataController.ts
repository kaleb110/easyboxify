import { Request, Response } from "express";
import {db} from "../db/index";
import { eq } from "drizzle-orm";
import {  Bookmark, Tag, Folder } from "../db/schema";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const deleteDataController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = Number(req.userId);
  try {
    await db.delete(Bookmark).where(eq(Bookmark.userId, userId));
    await db.delete(Tag).where(eq(Tag.userId, userId));
    await db.delete(Folder).where(eq(Folder.userId, userId));
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
