"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// router.get("/", getAllUsers);
router.get("/", authMiddleware_1.verifyToken, userController_1.getUser);
router.post("/", userController_1.createNewUser);
router.put("/", authMiddleware_1.verifyToken, userController_1.updateExistingUser);
router.put("/change-password", authMiddleware_1.verifyToken, userController_1.changePassword);
router.delete("/", authMiddleware_1.verifyToken, userController_1.removeUser);
// endpoint to get sort preference
router.get("/sort-preference", authMiddleware_1.verifyToken, userController_1.getSortPreference);
router.post("/sort-preference", authMiddleware_1.verifyToken, userController_1.setSortPreference);
router.get("/layout-preference", authMiddleware_1.verifyToken, userController_1.getLayoutPreference);
router.post("/layout-preference", authMiddleware_1.verifyToken, userController_1.setLayoutPreference);
exports.default = router;
