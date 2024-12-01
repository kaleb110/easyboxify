import { Request, Response } from "express";
import {
  getFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolderById,
} from "../service/folderServices";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getAllFolders = async (req: AuthenticatedRequest, res: Response) => {
  const folders = await getFolders();
  res.json(folders);
};

export const getFolder = async (req: Request, res: Response) => {
  const folder = await getFolderById(Number(req.params.id));
  if (!folder) return res.status(404).send("Folder not found");
  res.json(folder);
};

export const createNewFolder = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { name } = req.body;

  if (!userId) {
    return res.status(400).send("User ID not found");
  }

  try {
    const folder = await createFolder({ userId, name }); // Call the service to create the folder
    res.status(201).json(folder); // Respond with the created folder
  } catch (error) {
    res.status(500).send("Error creating folder");
  }
};

export const updateExistingFolder = async (req: Request, res: Response) => {
  const folder = await updateFolder(Number(req.params.id), req.body);
  if (!folder) return res.status(404).send("Folder not found");
  res.json(folder);
};

export const removeFolder = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Delete folder and associated bookmarks
    await deleteFolderById(Number(id));

    res.status(200).json({
      message: "Folder and associated bookmarks deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting folder and associated bookmarks:", error);
    res.status(500).json({ message: "Failed to delete folder" });
  }
};
