import { Router } from "express";
import {
  getAllUsers,
  getUser,
  createNewUser,
  updateExistingUser,
  removeUser,
} from "../controller/userController";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/", createNewUser);
router.put("/:id", updateExistingUser);
router.delete("/:id", removeUser);

export default router;
