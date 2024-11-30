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
exports.removeTag = exports.updateExistingTag = exports.createNewTag = exports.getTag = exports.getAllTags = void 0;
const tagServices_1 = require("../service/tagServices");
const getAllTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tags = yield (0, tagServices_1.getTags)();
    res.json(tags);
});
exports.getAllTags = getAllTags;
const getTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = yield (0, tagServices_1.getTagById)(Number(req.params.id));
    if (!tag)
        return res.status(404).send("Tag not found");
    res.json(tag);
});
exports.getTag = getTag;
const createNewTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { name } = req.body;
    if (!userId) {
        return res.status(400).send("User ID not found");
    }
    try {
        const tag = yield (0, tagServices_1.createTag)({ userId, name }); // Call the service to create the folder
        res.status(201).json(tag); // Respond with the created tag
    }
    catch (error) {
        res.status(500).send("Error creating folder");
    }
});
exports.createNewTag = createNewTag;
const updateExistingTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = yield (0, tagServices_1.updateTag)(Number(req.params.id), req.body);
    if (!tag)
        return res.status(404).send("Tag not found");
    res.json(tag);
});
exports.updateExistingTag = updateExistingTag;
const removeTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Delete tag and associated bookmarks
        yield (0, tagServices_1.deleteTagById)(Number(id));
        res
            .status(200)
            .json({
            message: "Tag deleted and associated bookmarks removed successfully",
        });
    }
    catch (error) {
        console.error("Error deleting tag and associated bookmarks:", error);
        res.status(500).json({ message: "Failed to delete tag" });
    }
});
exports.removeTag = removeTag;
