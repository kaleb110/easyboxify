import { Request, Response } from "express";
import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
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
  const tag = await deleteTag(Number(req.params.id));
  if (!tag) return res.status(404).send("Tag not found");
  res.json(tag);
};
