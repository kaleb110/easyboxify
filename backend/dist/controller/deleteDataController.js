"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDataController = void 0;
const index_1 = require("../db/index");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const deleteDataController = async (req, res) => {
    const userId = Number(req.userId);
    try {
        await index_1.db.delete(schema_1.Bookmark).where((0, drizzle_orm_1.eq)(schema_1.Bookmark.userId, userId));
        await index_1.db.delete(schema_1.Tag).where((0, drizzle_orm_1.eq)(schema_1.Tag.userId, userId));
        await index_1.db.delete(schema_1.Folder).where((0, drizzle_orm_1.eq)(schema_1.Folder.userId, userId));
        res.status(200).json({ message: "Data deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteDataController = deleteDataController;
