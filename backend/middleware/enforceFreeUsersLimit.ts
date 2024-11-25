import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { Folder, Tag, Bookmark, User } from "../db/schema";
import { eq, count } from "drizzle-orm";

// Middleware to enforce folder limit for free users
export const enforceFolderLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId; // Assuming userId is extracted from the token
  const userResult = await db
    .select()
    .from(User)
    .where(eq(User.id, userId))
    .limit(1);
  const user = userResult[0];

  if (user.plan === "free") {
    const folderCountResult = await db
      .select({ count: count() }) // Use count() to get the number of folders
      .from(Folder)
      .where(eq(Folder.userId, userId));
    const folderCount = folderCountResult[0]?.count ?? 0;

    console.log(`Folder count for user ${userId}: ${folderCount}`);

    if (folderCount >= 3) {
      return res.status(403).json({
        error: "Free plan limit reached: Maximum of 3 folders allowed.",
      });
    }
  }

  next();
};

// Middleware to enforce tag limit for free users
export const enforceTagLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId; // Assuming userId is extracted from the token
  const userResult = await db
    .select()
    .from(User)
    .where(eq(User.id, userId))
    .limit(1);
  const user = userResult[0];

  if (user.plan === "free") {
    const tagCountResult = await db
      .select({ count: count() }) // Use count() to get the number of tags
      .from(Tag)
      .where(eq(Tag.userId, userId));
    const tagCount = tagCountResult[0]?.count ?? 0;

    console.log(`Tag count for user ${userId}: ${tagCount}`);

    if (tagCount >= 2) {
      return res.status(403).json({
        error: "Free plan limit reached: Maximum of 3 tags allowed.",
      });
    }
  }

  next();
};

// Middleware to enforce bookmark limit for free users
export const enforceBookmarkLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId; // Assuming userId is extracted from the token
  const userResult = await db
    .select()
    .from(User)
    .where(eq(User.id, userId))
    .limit(1);
  const user = userResult[0];

  if (user.plan === "free") {
    const bookmarkCountResult = await db
      .select({ count: count() }) // Use count() to get the number of bookmarks
      .from(Bookmark)
      .where(eq(Bookmark.userId, userId));
    const bookmarkCount = bookmarkCountResult[0]?.count ?? 0;

    console.log(`Bookmark count for user ${userId}: ${bookmarkCount}`);

    if (bookmarkCount >= 100) {
      return res.status(403).json({
        error: "Free plan limit reached: Maximum of 100 bookmarks allowed.",
      });
    }
  }

  next();
};
