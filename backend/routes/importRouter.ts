import express from "express";
import multer from "multer";
import fs from "fs";
import { db } from "../db";
import { Bookmark, Folder } from "../db/schema";
import { Parser } from "htmlparser2";

const importRouter = express.Router();

// Configure Multer to store uploaded files in a temporary folder
const upload = multer({ dest: "uploads/" });

// Use Multer middleware to handle file uploads
importRouter.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;

  // Assume userId is provided in some way (e.g., middleware or other authentication)
  const userId = req.userId;

  if (!file || !userId) {
    return res
      .status(400)
      .json({ message: "File or user ID not provided or invalid" });
  }

  try {
    // Read file content
    const content = fs.readFileSync(file.path, "utf-8");
    const folderBookmarks = extractBookmarks(content);

    // Save folders and bookmarks to the database
    for (const folder of folderBookmarks) {
      // Create the folder first
      const createdFolder = await db.insert(Folder).values({
        userId: Number(userId),
        name: folder.name,
      });

      // Create the bookmarks for this folder
      for (const bookmark of folder.bookmarks) {
        await db.insert(Bookmark).values({
          userId: Number(userId),
          folderId: createdFolder.id,
          name: bookmark.title,
          url: bookmark.url,
        });
      }
    }

    // Remove the uploaded file after processing
    fs.unlinkSync(file.path);

    res.json({ message: "Bookmarks imported successfully" });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Function to extract bookmarks and folders from HTML content using htmlparser2
function extractBookmarks(htmlContent: string) {
  const folderBookmarks: Array<{
    name: string;
    bookmarks: Array<{ title: string; url: string }>;
  }> = [];
  let currentFolder: {
    name: string;
    bookmarks: Array<{ title: string; url: string }>;
  } | null = null;
  let currentLink: { title: string; url: string } | null = null;

  // Create a parser with event handlers
  const parser = new Parser(
    {
      onopentag(name, attributes) {
        // Detect folder <H3> tag
        if (name === "h3") {
          currentFolder = { name: "", bookmarks: [] };
        }

        // Detect bookmark <a> tag
        if (name === "a" && attributes.href) {
          currentLink = { title: "", url: attributes.href };
        }
      },
      ontext(text) {
        // If inside a folder <H3> tag, collect folder title
        if (currentFolder && currentFolder.name === "") {
          currentFolder.name = text.trim(); // Set the folder's title
        }

        // If inside a bookmark <a> tag, collect the bookmark title
        if (currentLink) {
          currentLink.title += text.trim();
        }
      },
      onclosetag(tagname) {
        // Close folder tag and add it to folderBookmarks
        if (tagname === "h3" && currentFolder) {
          folderBookmarks.push(currentFolder);
          currentFolder = null;
        }

        // Close bookmark <a> tag and add it to the current folder
        if (tagname === "a" && currentLink && currentFolder) {
          currentFolder.bookmarks.push(currentLink);
          currentLink = null;
        }
      },
    },
    { decodeEntities: true }
  );

  // Parse the HTML content
  parser.write(htmlContent);
  parser.end();

  return folderBookmarks;
}

export default importRouter;
