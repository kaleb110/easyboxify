"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const multer_1 = __importDefault(require("multer"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const cheerio = __importStar(require("cheerio")); // Ensure cheerio is imported correctly
const importRouter = express_1.default.Router();
// Configure Multer to use memory storage with a 2MB file size limit
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        // Only accept HTML files
        if (file.mimetype === "text/html") {
            cb(null, true);
        }
        else {
            cb(new Error("Only HTML files are allowed"));
        }
    },
});
importRouter.post("/", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const userId = req.userId;
    if (!file || !userId) {
        return res.status(400).json({ message: "File or user ID not provided" });
    }
    try {
        // File content is now in memory
        const content = file.buffer.toString("utf-8");
        const folderBookmarks = extractBookmarks(content);
        for (const folder of folderBookmarks) {
            const folderData = {
                userId: Number(userId),
                name: folder.title,
            };
            const [createdFolder] = yield db_1.db
                .insert(schema_1.Folder)
                .values(folderData)
                .returning({ id: schema_1.Folder.id });
            if (folder.bookmarks.length > 0) {
                const bookmarkData = folder.bookmarks.map((bookmark) => ({
                    userId: Number(userId),
                    folderId: createdFolder.id,
                    title: bookmark.title,
                    url: bookmark.url,
                }));
                const chunkSize = 100;
                for (let i = 0; i < bookmarkData.length; i += chunkSize) {
                    const chunk = bookmarkData.slice(i, i + chunkSize);
                    yield db_1.db.insert(schema_1.Bookmark).values(chunk);
                }
            }
        }
        res.json({ message: "Bookmarks imported successfully" });
    }
    catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
function extractBookmarks(htmlContent) {
    const folderBookmarks = [];
    try {
        const $ = cheerio.load(htmlContent);
        $("DL")
            .children("DT")
            .each((i, element) => {
            const h3 = $(element).children("H3").first();
            if (h3.length) {
                const folderTitle = h3.text().trim();
                const bookmarks = [];
                const bookmarkList = $(element).children("DL").first();
                bookmarkList.children("DT").each((j, bookmarkElem) => {
                    const anchor = $(bookmarkElem).children("A").first();
                    const bookmarkTitle = anchor.text().trim();
                    const bookmarkUrl = anchor.attr("href");
                    if (bookmarkUrl && bookmarkTitle) {
                        bookmarks.push({ title: bookmarkTitle, url: bookmarkUrl });
                    }
                });
                if (folderTitle) {
                    folderBookmarks.push({ title: folderTitle, bookmarks });
                }
            }
        });
        if (folderBookmarks.length === 0) {
            throw new Error("No folders found in file");
        }
        return folderBookmarks;
    }
    catch (error) {
        console.error("Error parsing HTML:", error);
        throw new Error(`Failed to parse bookmark file: ${error.message}`);
    }
}
exports.default = importRouter;
