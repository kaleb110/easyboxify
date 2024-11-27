import express from "express";
import multer from "multer";
import { db } from "../db";
import { Bookmark, Folder } from "../db/schema";
import * as cheerio from "cheerio"; // Ensure cheerio is imported correctly

const importRouter = express.Router();

// Configure Multer to use memory storage with a 2MB file size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Only accept HTML files
    if (file.mimetype === "text/html") {
      cb(null, true);
    } else {
      cb(new Error("Only HTML files are allowed"));
    }
  },
});

importRouter.post("/", upload.single("file"), async (req, res) => {
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

      const [createdFolder] = await db
        .insert(Folder)
        .values(folderData)
        .returning({ id: Folder.id });

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
          await db.insert(Bookmark).values(chunk);
        }
      }
    }

    res.json({ message: "Bookmarks imported successfully" });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

function extractBookmarks(htmlContent: string) {
  const folderBookmarks: Array<{
    title: string;
    bookmarks: Array<{ title: string; url: string }>;
  }> = [];

  try {
    const $ = cheerio.load(htmlContent);

    $("DL")
      .children("DT")
      .each((i, element) => {
        const h3 = $(element).children("H3").first();
        if (h3.length) {
          const folderTitle = h3.text().trim();
          const bookmarks: Array<{ title: string; url: string }> = [];

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
  } catch (error) {
    console.error("Error parsing HTML:", error);
    throw new Error(`Failed to parse bookmark file: ${error.message}`);
  }
}

export default importRouter;
