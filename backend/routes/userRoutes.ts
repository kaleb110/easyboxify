import { Router } from "express";
import {
  getUser,
  createNewUser,
  updateExistingUser,
  removeUser,
} from "../controller/userController";
import verifyToken from "../middleware/verifyToken";
const router = Router();

// router.get("/", getAllUsers);
router.get("/", verifyToken, getUser);
router.post("/", createNewUser);
router.put("/:id", updateExistingUser);
router.delete("/:id", removeUser);

export default router;
