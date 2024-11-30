"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.changePassword = exports.updateExistingUser = exports.createNewUser = exports.getUser = void 0;
const userServices_1 = require("../service/userServices");
// export const getAllUsers = async (req: Request, res: Response) => {
//   const users = await getUsers();
//   res.json(users);
// };
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const user = yield (0, userServices_1.getUserById)(Number(userId));
    if (!user)
        return res.status(404).send("User not found");
    res.json(user);
});
exports.getUser = getUser;
const createNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userServices_1.createUser)(req.body);
    res.status(201).json(user);
});
exports.createNewUser = createNewUser;
const updateExistingUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const user = yield (0, userServices_1.updateUser)(Number(userId), req.body);
    if (!user)
        return res.status(404).send("User not found");
    res.json(user);
});
exports.updateExistingUser = updateExistingUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const user = yield (0, userServices_1.changeUserPassword)(Number(userId), req.body);
    if (!user)
        return res.status(404).send("Can not change password!");
    res.json("Password changed successfully!");
});
exports.changePassword = changePassword;
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userServices_1.deleteUser)(Number(req.params.id));
    if (!user)
        return res.status(404).send("User not found");
    res.json(user);
});
exports.removeUser = removeUser;
