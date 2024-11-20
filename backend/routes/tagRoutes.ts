import { Router } from "express";
import {
  getAllTags,
  getTag,
  createNewTag,
  updateExistingTag,
  removeTag,
} from "../controller/tagsController";

const router = Router();

router.get("/", getAllTags);
router.get("/:id", getTag);
router.post("/", createNewTag);
router.put("/:id", updateExistingTag);
router.delete("/:id", removeTag);

export default router;
