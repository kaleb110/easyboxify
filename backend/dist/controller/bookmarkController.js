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
exports.addTags = exports.removeBookmark = exports.updateExistingBookmark = exports.createNewBookmark = exports.getBookmark = exports.getAllBookmarks = void 0;
// TODO: check on the import addTagsToBookmark
const bookmarkServices_1 = require("../service/bookmarkServices");
const getAllBookmarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookmarks = yield (0, bookmarkServices_1.getBookmarks)();
    res.json(bookmarks);
});
exports.getAllBookmarks = getAllBookmarks;
const getBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookmark = yield (0, bookmarkServices_1.getBookmarkById)(Number(req.params.id));
    if (!bookmark)
        return res.status(404).send("Bookmark not found");
    res.json(bookmark);
});
exports.getBookmark = getBookmark;
const createNewBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).send("User ID not found");
    }
    try {
        const bookmark = yield (0, bookmarkServices_1.createBookmark)(Object.assign({ userId }, req.body));
        res.status(201).json(bookmark);
    }
    catch (error) {
        res.status(500).send("Error creating folder");
    }
});
exports.createNewBookmark = createNewBookmark;
const updateExistingBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookmark = yield (0, bookmarkServices_1.updateBookmark)(Number(req.params.id), req.body);
    if (!bookmark)
        return res.status(404).send("Bookmark not found");
    res.json(bookmark);
});
exports.updateExistingBookmark = updateExistingBookmark;
const removeBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookmark = yield (0, bookmarkServices_1.deleteBookmark)(Number(req.params.id));
    if (!bookmark)
        return res.status(404).send("Bookmark not found");
    res.json(bookmark);
});
exports.removeBookmark = removeBookmark;
const addTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookmarkId, tagIds } = req.body;
    const result = yield (0, bookmarkServices_1.addTagsToBookmark)(bookmarkId, tagIds);
    res.json(result);
});
exports.addTags = addTags;
