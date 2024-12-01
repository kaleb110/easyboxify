import { Request, Response } from "express";
// TODO: check on the import addTagsToBookmark
import {
  getBookmarks,
  getBookmarkById,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  // addTagsToBookmark,
} from "../service/bookmarkServices";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getAllBookmarks = async (req: Request, res: Response) => {
  const bookmarks = await getBookmarks();
  res.json(bookmarks);
};

export const getBookmark = async (req: Request, res: Response) => {
  const bookmark = await getBookmarkById(Number(req.params.id));
  if (!bookmark) return res.status(404).send("Bookmark not found");
  res.json(bookmark);
};

export const createNewBookmark = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).send("User ID not found");
  }

  try {
    const bookmark = await createBookmark({ userId, ...req.body });
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).send("Error creating folder");
  }
};

export const updateExistingBookmark = async (req: Request, res: Response) => {
  const bookmark = await updateBookmark(Number(req.params.id), req.body);
  if (!bookmark) return res.status(404).send("Bookmark not found");
  res.json(bookmark);
};

export const removeBookmark = async (req: Request, res: Response) => {
  const bookmark = await deleteBookmark(Number(req.params.id));
  if (!bookmark) return res.status(404).send("Bookmark not found");
  res.json(bookmark);
};

// export const addTags = async (req: Request, res: Response) => {
//   const { bookmarkId, tagIds } = req.body;
//   const result = await addTagsToBookmark(bookmarkId, tagIds);
//   res.json(result);
// };
