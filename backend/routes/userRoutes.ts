import { Router } from "express";
import {
  getUser,
  createNewUser,
  updateExistingUser,
  removeUser,
  changePassword,
  getSortPreference,
  setSortPreference,
  getLayoutPreference,
  setLayoutPreference,
} from "../controller/userController";
import {verifyToken} from "../middleware/authMiddleware";
const router = Router();

// router.get("/", getAllUsers);
router.get("/", verifyToken, getUser);
router.post("/", createNewUser);
router.put("/", verifyToken, updateExistingUser);
router.put("/change-password", verifyToken, changePassword);
router.delete("/", verifyToken, removeUser);
// endpoint to get sort preference
router.get("/sort-preference", verifyToken, getSortPreference); 
router.post("/sort-preference", verifyToken, setSortPreference);
router.get("/layout-preference", verifyToken, getLayoutPreference);
router.post("/layout-preference", verifyToken, setLayoutPreference);

export default router;
