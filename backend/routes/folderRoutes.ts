import { Router } from "express";
import {
  getAllFolders,
  getFolder,
  createNewFolder,
  updateExistingFolder,
  removeFolder,
} from "../controller/foldersController";

const router = Router();

router.get("/", getAllFolders);
router.get("/:id", getFolder);
router.post("/", createNewFolder);
router.put("/:id", updateExistingFolder);
router.delete("/:id", removeFolder);

export default router;
