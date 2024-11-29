import { Request, Response } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
} from "../service/userServices";

// export const getAllUsers = async (req: Request, res: Response) => {
//   const users = await getUsers();
//   res.json(users);
// };

export const getUser = async (req: Request, res: Response) => {
  const userId = req.userId
  const user = await getUserById(Number(userId));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
};

export const createNewUser = async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
};

export const updateExistingUser = async (req: Request, res: Response) => {
  const userId = req.userId
  const user = await updateUser(Number(userId), req.body);
  if (!user) return res.status(404).send("User not found");
  res.json(user);
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = req.userId
  const user = await changeUserPassword(Number(userId), req.body);
  if (!user) return res.status(404).send("Can not change password!");
  res.json("Password changed successfully!");
}

export const removeUser = async (req: Request, res: Response) => {
  const user = await deleteUser(Number(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
};
