import { Request, Response } from "express";
import {
  getBookmarks,
  getBookmarkById,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  addTagsToBookmark,
} from "../service/bookmarkServices";

export const getAllBookmarks = async (req: Request, res: Response) => {
  const bookmarks = await getBookmarks();
  res.json(bookmarks);
};

export const getBookmark = async (req: Request, res: Response) => {
  const bookmark = await getBookmarkById(Number(req.params.id));
  if (!bookmark) return res.status(404).send("Bookmark not found");
  res.json(bookmark);
};

export const createNewBookmark = async (req: Request, res: Response) => {
  const bookmark = await createBookmark(req.body);
  res.status(201).json(bookmark);
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

export const addTags = async (req: Request, res: Response) => {
  const { bookmarkId, tagIds } = req.body;
  const result = await addTagsToBookmark(bookmarkId, tagIds);
  res.json(result);
};
