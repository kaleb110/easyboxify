import { Request, Response } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../service/userServices";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await getUsers();
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const user = await getUserById(Number(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
};

export const createNewUser = async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
};

export const updateExistingUser = async (req: Request, res: Response) => {
  const user = await updateUser(Number(req.params.id), req.body);
  if (!user) return res.status(404).send("User not found");
  res.json(user);
};

export const removeUser = async (req: Request, res: Response) => {
  const user = await deleteUser(Number(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
};
