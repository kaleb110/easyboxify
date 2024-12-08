"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLayoutPreference = exports.getLayoutPreference = exports.setSortPreference = exports.getSortPreference = exports.removeUser = exports.changePassword = exports.updateExistingUser = exports.createNewUser = exports.getUser = void 0;
const userServices_1 = require("../service/userServices");
// export const getAllUsers = async (req: Request, res: Response) => {
//   const users = await getUsers();
//   res.json(users);
// };
const getUser = async (req, res) => {
    const userId = req.userId;
    const user = await (0, userServices_1.getUserById)(Number(userId));
    if (!user)
        return res.status(404).send("User not found");
    res.json(user);
};
exports.getUser = getUser;
const createNewUser = async (req, res) => {
    const user = await (0, userServices_1.createUser)(req.body);
    res.status(201).json(user);
};
exports.createNewUser = createNewUser;
const updateExistingUser = async (req, res) => {
    const userId = req.userId;
    const user = await (0, userServices_1.updateUser)(Number(userId), req.body);
    if (!user)
        return res.status(404).send("User not found");
    res.json(user);
};
exports.updateExistingUser = updateExistingUser;
const changePassword = async (req, res) => {
    const userId = req.userId;
    const user = await (0, userServices_1.changeUserPassword)(Number(userId), req.body);
    if (!user)
        return res.status(404).send("Can not change password!");
    res.json("Password changed successfully!");
};
exports.changePassword = changePassword;
const removeUser = async (req, res) => {
    const userId = req.userId;
    const user = await (0, userServices_1.deleteUser)(Number(userId));
    if (!user)
        return res.status(404).send("User not found");
    res.json(user);
};
exports.removeUser = removeUser;
// prefrences
const getSortPreference = async (req, res) => {
    const userId = req.userId;
    const sortPreference = await (0, userServices_1.getSortPreferenceService)(Number(userId));
    res.json({ sortPreference });
};
exports.getSortPreference = getSortPreference;
const setSortPreference = async (req, res) => {
    const userId = req.userId;
    const { sortPreference } = req.body;
    await (0, userServices_1.setSortPreferenceService)(Number(userId), sortPreference);
    res.json({ message: "Sort preference updated" });
};
exports.setSortPreference = setSortPreference;
// layout
const getLayoutPreference = async (req, res) => {
    const userId = req.userId;
    const layoutPreference = await (0, userServices_1.getLayoutPreferenceService)(Number(userId));
    res.json({ layoutPreference });
};
exports.getLayoutPreference = getLayoutPreference;
const setLayoutPreference = async (req, res) => {
    const userId = req.userId;
    const { layoutPreference } = req.body;
    await (0, userServices_1.setLayoutPreferenceService)(Number(userId), layoutPreference);
    res.json({ message: "Layout preference updated" });
};
exports.setLayoutPreference = setLayoutPreference;
