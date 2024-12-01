import { Request, Response } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getSortPreferenceService,
  setSortPreferenceService,
  getLayoutPreferenceService,
  setLayoutPreferenceService,
} from "../service/userServices";

// Add this at the top of the file
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// export const getAllUsers = async (req: Request, res: Response) => {
//   const users = await getUsers();
//   res.json(users);
// };

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const user = await getUserById(Number(userId));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
};

export const createNewUser = async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
};

export const updateExistingUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const user = await updateUser(Number(userId), req.body);
  if (!user) return res.status(404).send("User not found");
  res.json(user);
};

export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const user = await changeUserPassword(Number(userId), req.body);
  if (!user) return res.status(404).send("Can not change password!");
  res.json("Password changed successfully!");
};

export const removeUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const user = await deleteUser(Number(userId));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
};

// prefrences
export const getSortPreference = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const sortPreference = await getSortPreferenceService(Number(userId));
  res.json({ sortPreference });
};

export const setSortPreference = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { sortPreference } = req.body;
  await setSortPreferenceService(Number(userId), sortPreference);
  res.json({ message: "Sort preference updated" });
};

// layout
export const getLayoutPreference = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.userId;
  const layoutPreference = await getLayoutPreferenceService(Number(userId));
  res.json({ layoutPreference });
};

export const setLayoutPreference = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.userId;
  const { layoutPreference } = req.body;
  await setLayoutPreferenceService(Number(userId), layoutPreference);
  res.json({ message: "Layout preference updated" });
};
