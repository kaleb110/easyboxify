"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLayoutPreferenceService = exports.getLayoutPreferenceService = exports.setSortPreferenceService = exports.getSortPreferenceService = exports.deleteUser = exports.changeUserPassword = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
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
const getUsers = async () => index_1.db.select().from(schema_1.User);
exports.getUsers = getUsers;
const getUserById = async (id) => index_1.db.select().from(schema_1.User).where((0, drizzle_orm_1.eq)(schema_1.User.id, id)).limit(1);
exports.getUserById = getUserById;
const createUser = async (userData) => index_1.db.insert(schema_1.User).values(userData).returning(allUserColumns);
exports.createUser = createUser;
const updateUser = async (id, userData) => index_1.db
    .update(schema_1.User)
    .set(userData)
    .where((0, drizzle_orm_1.eq)(schema_1.User.id, id))
    .returning(allUserColumns);
exports.updateUser = updateUser;
const changeUserPassword = async (id, data) => {
    const { currentPassword, newPassword } = data;
    const userResult = await index_1.db
        .select()
        .from(schema_1.User)
        .where((0, drizzle_orm_1.eq)(schema_1.User.id, id))
        .limit(1);
    const user = userResult[0];
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword)
        throw new Error("Password is incorrect!");
    // hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // update the database
    return await index_1.db
        .update(schema_1.User)
        .set({ password: hashedPassword })
        .where((0, drizzle_orm_1.eq)(schema_1.User.id, id));
};
exports.changeUserPassword = changeUserPassword;
const deleteUser = async (id) => index_1.db.delete(schema_1.User).where((0, drizzle_orm_1.eq)(schema_1.User.id, id)).returning(allUserColumns);
exports.deleteUser = deleteUser;
const getSortPreferenceService = async (id) => {
    const sortPreference = await index_1.db.select().from(schema_1.User).where((0, drizzle_orm_1.eq)(schema_1.User.id, id));
    return sortPreference[0].sortPreference;
};
exports.getSortPreferenceService = getSortPreferenceService;
const setSortPreferenceService = async (id, sortPreference) => {
    await index_1.db.update(schema_1.User).set({ sortPreference }).where((0, drizzle_orm_1.eq)(schema_1.User.id, id));
};
exports.setSortPreferenceService = setSortPreferenceService;
const getLayoutPreferenceService = async (id) => {
    const layoutPreference = await index_1.db.select().from(schema_1.User).where((0, drizzle_orm_1.eq)(schema_1.User.id, id));
    return layoutPreference[0].layoutPreference;
};
exports.getLayoutPreferenceService = getLayoutPreferenceService;
const setLayoutPreferenceService = async (id, layoutPreference) => {
    await index_1.db.update(schema_1.User).set({ layoutPreference }).where((0, drizzle_orm_1.eq)(schema_1.User.id, id));
};
exports.setLayoutPreferenceService = setLayoutPreferenceService;
