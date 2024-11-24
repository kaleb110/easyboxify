import { Request, Response } from "express";
import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTagById,
} from "../service/tagServices";

export const getAllTags = async (req: Request, res: Response) => {
  const tags = await getTags();
  res.json(tags);
};

export const getTag = async (req: Request, res: Response) => {
  const tag = await getTagById(Number(req.params.id));
  if (!tag) return res.status(404).send("Tag not found");
  res.json(tag);
};

export const createNewTag = async (req: Request, res: Response) => {
  const tag = await createTag(req.body);
  res.status(201).json(tag);
};

export const updateExistingTag = async (req: Request, res: Response) => {
  const tag = await updateTag(Number(req.params.id), req.body);
  if (!tag) return res.status(404).send("Tag not found");
  res.json(tag);
};

export const removeTag = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Delete tag and associated bookmarks
    await deleteTagById(Number(id));

    res
      .status(200)
      .json({
        message: "Tag deleted and associated bookmarks removed successfully",
      });
  } catch (error) {
    console.error("Error deleting tag and associated bookmarks:", error);
    res.status(500).json({ message: "Failed to delete tag" });
  }
};
