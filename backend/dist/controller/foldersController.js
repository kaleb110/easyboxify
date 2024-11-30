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
exports.removeFolder = exports.updateExistingFolder = exports.createNewFolder = exports.getFolder = exports.getAllFolders = void 0;
const folderServices_1 = require("../service/folderServices");
const getAllFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const folders = yield (0, folderServices_1.getFolders)();
    res.json(folders);
});
exports.getAllFolders = getAllFolders;
const getFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const folder = yield (0, folderServices_1.getFolderById)(Number(req.params.id));
    if (!folder)
        return res.status(404).send("Folder not found");
    res.json(folder);
});
exports.getFolder = getFolder;
const createNewFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { name } = req.body;
    if (!userId) {
        return res.status(400).send("User ID not found");
    }
    try {
        const folder = yield (0, folderServices_1.createFolder)({ userId, name }); // Call the service to create the folder
        res.status(201).json(folder); // Respond with the created folder
    }
    catch (error) {
        res.status(500).send("Error creating folder");
    }
});
exports.createNewFolder = createNewFolder;
const updateExistingFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const folder = yield (0, folderServices_1.updateFolder)(Number(req.params.id), req.body);
    if (!folder)
        return res.status(404).send("Folder not found");
    res.json(folder);
});
exports.updateExistingFolder = updateExistingFolder;
const removeFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Delete folder and associated bookmarks
        yield (0, folderServices_1.deleteFolderById)(Number(id));
        res.status(200).json({
            message: "Folder and associated bookmarks deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting folder and associated bookmarks:", error);
        res.status(500).json({ message: "Failed to delete folder" });
    }
});
exports.removeFolder = removeFolder;
