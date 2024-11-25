import { authenticate } from './../middleware/authMiddleware';
import { Router } from "express";
import {
  getAllFolders,
  getFolder,
  createNewFolder,
  updateExistingFolder,
  removeFolder,
} from "../controller/foldersController";
import { enforceFolderLimit } from '../middleware/enforceFreeUsersLimit';
const router = Router();

router.get("/", getAllFolders);
router.get("/:id", getFolder);
router.post("/", authenticate, enforceFolderLimit, createNewFolder);
router.put("/:id", updateExistingFolder);
router.delete("/:id", removeFolder);

export default router;
