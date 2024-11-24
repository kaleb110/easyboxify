import { authenticate } from './../middleware/authMiddleware';
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
router.post("/", authenticate, createNewFolder);
router.put("/:id", updateExistingFolder);
router.delete("/:id", removeFolder);

export default router;
