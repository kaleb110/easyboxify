"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookmarkController_1 = require("../controller/bookmarkController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const enforceFreeUsersLimit_1 = require("../middleware/enforceFreeUsersLimit");
const router = (0, express_1.Router)();
router.get("/", bookmarkController_1.getAllBookmarks);
router.get("/:id", bookmarkController_1.getBookmark);
router.post("/", authMiddleware_1.authenticate, enforceFreeUsersLimit_1.enforceBookmarkLimit, bookmarkController_1.createNewBookmark);
router.put("/:id", bookmarkController_1.updateExistingBookmark);
router.delete("/:id", bookmarkController_1.removeBookmark);
router.post("/tags", bookmarkController_1.addTags); // Endpoint to add tags to a bookmark
exports.default = router;
