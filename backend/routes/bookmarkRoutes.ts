import { Router } from "express";
import {
  getAllBookmarks,
  getBookmark,
  createNewBookmark,
  updateExistingBookmark,
  removeBookmark,
  addTags,
} from "../controller/bookmarkController";

const router = Router();

router.get("/", getAllBookmarks);
router.get("/:id", getBookmark);
router.post("/", createNewBookmark);
router.put("/:id", updateExistingBookmark);
router.delete("/:id", removeBookmark);
router.post("/tags", addTags); // Endpoint to add tags to a bookmark

export default router;
