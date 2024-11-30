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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const exportRouter = express_1.default.Router();
// Export endpoint to generate HTML file of bookmarks and folders
exportRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        // Fetch folders and associated bookmarks from the database
        const folders = yield db_1.db
            .select()
            .from(schema_1.Folder)
            .where((0, drizzle_orm_1.eq)(schema_1.Folder.userId, Number(userId)));
        if (folders.length === 0) {
            return res.status(404).json({ message: "No folders found" });
        }
        // For each folder, fetch its bookmarks
        const folderBookmarks = yield Promise.all(folders.map((folder) => __awaiter(void 0, void 0, void 0, function* () {
            const bookmarks = yield db_1.db
                .select()
                .from(schema_1.Bookmark)
                .where((0, drizzle_orm_1.eq)(schema_1.Bookmark.folderId, folder.id));
            return { folder, bookmarks: Array.isArray(bookmarks) ? bookmarks : [] }; // Ensure bookmarks is an array
        })));
        // Generate HTML content for bookmarks grouped by folders
        const htmlContent = generateHTML(folderBookmarks);
        // Set headers for file download
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Content-Disposition", "attachment; filename=bookmarks.html");
        res.send(htmlContent);
    }
    catch (error) {
        console.error("Error exporting bookmarks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Helper function to generate HTML content with folders and bookmarks
function generateHTML(folderBookmarks) {
    let html = "<!DOCTYPE NETSCAPE-Bookmark-file-1>\n";
    html +=
        '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n';
    html += "<TITLE>Bookmarks</TITLE>\n";
    html += "<H1>Bookmarks</H1>\n";
    html += "<DL><p>\n";
    folderBookmarks.forEach(({ folder, bookmarks }) => {
        html += `<DT><H3>${folder.name}</H3>\n<DL><p>\n`;
        bookmarks.forEach((bookmark) => {
            html += `<DT><A HREF="${bookmark.url}">${bookmark.title}</A>\n`;
        });
        html += "</DL><p>\n";
    });
    html += "</DL><p>\n";
    return html;
}
exports.default = exportRouter;
