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
  const userId = req.userId;
  const { name } = req.body;

  if (!userId) {
    return res.status(400).send("User ID not found");
  }

  try {
    const tag = await createTag({ userId, name }); // Call the service to create the folder
    res.status(201).json(tag); // Respond with the created tag
  } catch (error) {
    res.status(500).send("Error creating folder");
  }
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
