import { Router } from "express";
import {
  getUser,
  createNewUser,
  updateExistingUser,
  removeUser,
  changePassword,
} from "../controller/userController";
import verifyToken from "../middleware/verifyToken";
const router = Router();

// router.get("/", getAllUsers);
router.get("/", verifyToken, getUser);
router.post("/", createNewUser);
router.put("/", verifyToken, updateExistingUser);
router.put("/change-password", verifyToken, changePassword);
router.delete("/:id", removeUser);

export default router;
