import { Router } from "express";
import {
  getAllBookmarks,
  getBookmark,
  createNewBookmark,
  updateExistingBookmark,
  removeBookmark,
  // addTags,
} from "../controller/bookmarkController";
import { authenticate } from "../middleware/authMiddleware";
import { enforceBookmarkLimit } from "../middleware/enforceFreeUsersLimit";
const router = Router();

router.get("/", getAllBookmarks);
router.get("/:id", getBookmark);
router.post("/", authenticate, enforceBookmarkLimit, createNewBookmark);
router.put("/:id", updateExistingBookmark);
router.delete("/:id", removeBookmark);
// router.post("/tags", addTags); // Endpoint to add tags to a bookmark


export default router;
