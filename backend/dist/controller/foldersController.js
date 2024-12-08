"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFolder = exports.updateExistingFolder = exports.createNewFolder = exports.getFolder = exports.getAllFolders = void 0;
const folderServices_1 = require("../service/folderServices");
const getAllFolders = async (req, res) => {
    const folders = await (0, folderServices_1.getFolders)();
    res.json(folders);
};
exports.getAllFolders = getAllFolders;
const getFolder = async (req, res) => {
    const folder = await (0, folderServices_1.getFolderById)(Number(req.params.id));
    if (!folder)
        return res.status(404).send("Folder not found");
    res.json(folder);
};
exports.getFolder = getFolder;
const createNewFolder = async (req, res) => {
    const userId = req.userId;
    const { name } = req.body;
    if (!userId) {
        return res.status(400).send("User ID not found");
    }
    try {
        const folder = await (0, folderServices_1.createFolder)({ userId, name }); // Call the service to create the folder
        res.status(201).json(folder); // Respond with the created folder
    }
    catch (error) {
        res.status(500).send("Error creating folder");
    }
};
exports.createNewFolder = createNewFolder;
const updateExistingFolder = async (req, res) => {
    const folder = await (0, folderServices_1.updateFolder)(Number(req.params.id), req.body);
    if (!folder)
        return res.status(404).send("Folder not found");
    res.json(folder);
};
exports.updateExistingFolder = updateExistingFolder;
const removeFolder = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete folder and associated bookmarks
        await (0, folderServices_1.deleteFolderById)(Number(id));
        res.status(200).json({
            message: "Folder and associated bookmarks deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting folder and associated bookmarks:", error);
        res.status(500).json({ message: "Failed to delete folder" });
    }
};
exports.removeFolder = removeFolder;
