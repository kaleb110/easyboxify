import express from "express";
import { db } from "../db";
import { Bookmark, Folder } from "../db/schema";
import { eq } from "drizzle-orm";

const exportRouter = express.Router();

// Export endpoint to generate HTML file of bookmarks and folders
exportRouter.get("/", async (req, res) => {
  const userId = req.userId;

  try {
    // Fetch folders and associated bookmarks from the database
    const folders = await db
      .select()
      .from(Folder)
      .where(eq(Folder.userId, Number(userId)));

    if (folders.length === 0) {
      return res.status(404).json({ message: "No folders found" });
    }

    // For each folder, fetch its bookmarks
    const folderBookmarks = await Promise.all(
      folders.map(async (folder) => {
        const bookmarks = await db
          .select()
          .from(Bookmark)
          .where(eq(Bookmark.folderId, folder.id));
        return { folder, bookmarks: Array.isArray(bookmarks) ? bookmarks : [] }; // Ensure bookmarks is an array
      })
    );

    // Generate HTML content for bookmarks grouped by folders
    const htmlContent = generateHTML(folderBookmarks);

    // Set headers for file download
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", "attachment; filename=bookmarks.html");
    res.send(htmlContent);
  } catch (error) {
    console.error("Error exporting bookmarks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Helper function to generate HTML content with folders and bookmarks
function generateHTML(
  folderBookmarks: Array<{
    folder: { name: string };
    bookmarks: Array<{ title: string; url: string }>;
  }>
) {
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

export default exportRouter;
