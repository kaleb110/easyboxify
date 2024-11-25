import { Router } from "express";
import {
  getAllTags,
  getTag,
  createNewTag,
  updateExistingTag,
  removeTag,
} from "../controller/tagsController";
import { authenticate } from "../middleware/authMiddleware";
import { enforceTagLimit } from "../middleware/enforceFreeUsersLimit";
const router = Router();

router.get("/", getAllTags);
router.get("/:id", getTag);
router.post("/", authenticate, enforceTagLimit, createNewTag);
router.put("/:id", updateExistingTag);
router.delete("/:id", removeTag);

export default router;
