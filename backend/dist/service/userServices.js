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
exports.deleteUser = exports.changeUserPassword = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const index_1 = require("../db/index");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt = require("bcryptjs");
// Utility to get all columns from the User table
const allUserColumns = {
    id: schema_1.User.id,
    name: schema_1.User.name,
    email: schema_1.User.email,
    password: schema_1.User.password,
    role: schema_1.User.role,
    verified: schema_1.User.verified,
    resetToken: schema_1.User.resetToken,
    resetTokenExpiry: schema_1.User.resetTokenExpiry,
};
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () { return index_1.db.select().from(schema_1.User); });
exports.getUsers = getUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () { return index_1.db.select().from(schema_1.User).where((0, drizzle_orm_1.eq)(schema_1.User.id, id)).limit(1); });
exports.getUserById = getUserById;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () { return index_1.db.insert(schema_1.User).values(userData).returning(allUserColumns); });
exports.createUser = createUser;
const updateUser = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    return index_1.db
        .update(schema_1.User)
        .set(userData)
        .where((0, drizzle_orm_1.eq)(schema_1.User.id, id))
        .returning(allUserColumns);
});
exports.updateUser = updateUser;
const changeUserPassword = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = data;
    const userResult = yield index_1.db
        .select()
        .from(schema_1.User)
        .where((0, drizzle_orm_1.eq)(schema_1.User.id, id))
        .limit(1);
    const user = userResult[0];
    const validPassword = yield bcrypt.compare(currentPassword, user.password);
    if (!validPassword)
        throw new Error("Password is incorrect!");
    // hash the password
    const hashedPassword = yield bcrypt.hash(newPassword, 10);
    // update the database
    return yield index_1.db
        .update(schema_1.User)
        .set({ password: hashedPassword })
        .where((0, drizzle_orm_1.eq)(schema_1.User.id, id));
});
exports.changeUserPassword = changeUserPassword;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () { return index_1.db.delete(schema_1.User).where((0, drizzle_orm_1.eq)(schema_1.User.id, id)).returning(allUserColumns); });
exports.deleteUser = deleteUser;
