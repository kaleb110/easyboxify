import { Request, Response } from "express";
import {
  getFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
} from "../service/folderServices";

export const getAllFolders = async (req: Request, res: Response) => {
  const folders = await getFolders();
  res.json(folders);
};

export const getFolder = async (req: Request, res: Response) => {
  const folder = await getFolderById(Number(req.params.id));
  if (!folder) return res.status(404).send("Folder not found");
  res.json(folder);
};

export const createNewFolder = async (req: Request, res: Response) => {
  const folder = await createFolder(req.body);
  res.status(201).json(folder);
};

export const updateExistingFolder = async (req: Request, res: Response) => {
  const folder = await updateFolder(Number(req.params.id), req.body);
  if (!folder) return res.status(404).send("Folder not found");
  res.json(folder);
};

export const removeFolder = async (req: Request, res: Response) => {
  const folder = await deleteFolder(Number(req.params.id));
  if (!folder) return res.status(404).send("Folder not found");
  res.json(folder);
};
