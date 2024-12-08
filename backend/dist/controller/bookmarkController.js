"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBookmark = exports.updateExistingBookmark = exports.createNewBookmark = exports.getBookmark = exports.getAllBookmarks = void 0;
// TODO: check on the import addTagsToBookmark
const bookmarkServices_1 = require("../service/bookmarkServices");
const getAllBookmarks = async (req, res) => {
    const bookmarks = await (0, bookmarkServices_1.getBookmarks)();
    res.json(bookmarks);
};
exports.getAllBookmarks = getAllBookmarks;
const getBookmark = async (req, res) => {
    const bookmark = await (0, bookmarkServices_1.getBookmarkById)(Number(req.params.id));
    if (!bookmark)
        return res.status(404).send("Bookmark not found");
    res.json(bookmark);
};
exports.getBookmark = getBookmark;
const createNewBookmark = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).send("User ID not found");
    }
    try {
        const bookmark = await (0, bookmarkServices_1.createBookmark)({ userId, ...req.body });
        res.status(201).json(bookmark);
    }
    catch (error) {
        res.status(500).send("Error creating bookmark");
        console.error(error);
    }
};
exports.createNewBookmark = createNewBookmark;
const updateExistingBookmark = async (req, res) => {
    const bookmark = await (0, bookmarkServices_1.updateBookmark)(Number(req.params.id), req.body);
    if (!bookmark)
        return res.status(404).send("Bookmark not found");
    res.json(bookmark);
};
exports.updateExistingBookmark = updateExistingBookmark;
const removeBookmark = async (req, res) => {
    const bookmark = await (0, bookmarkServices_1.deleteBookmark)(Number(req.params.id));
    if (!bookmark)
        return res.status(404).send("Bookmark not found");
    res.json(bookmark);
};
exports.removeBookmark = removeBookmark;
// export const addTags = async (req: Request, res: Response) => {
//   const { bookmarkId, tagIds } = req.body;
//   const result = await addTagsToBookmark(bookmarkId, tagIds);
//   res.json(result);
// };
