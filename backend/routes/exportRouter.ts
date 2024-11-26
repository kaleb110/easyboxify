// routes/export.ts
import express from "express";
import { db } from "../db";
import { Bookmark } from "../db/schema";
import { eq } from "drizzle-orm";

const exportRouter = express.Router();

// Export endpoint to generate HTML file of bookmarks
exportRouter.get("/", async (req, res) => {
  const userId = req.userId;

  try {
    // Fetch bookmarks from the database for the given user ID
    const bookmarks = await db
      .select()
      .from(Bookmark)
      .where(eq(Bookmark.userId, Number(userId)));

    if (bookmarks.length === 0) {
      return res.status(404).json({ message: "No bookmarks found" });
    }

    // Generate HTML content for bookmarks
    const htmlContent = generateHTML(bookmarks);

    // Set headers for file download
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", "attachment; filename=bookmarks.html");
    res.send(htmlContent);
  } catch (error) {
    console.error("Error exporting bookmarks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Helper function to generate HTML content
function generateHTML(bookmarks: Array<{ title: string; url: string }>) {
  let html = "<!DOCTYPE NETSCAPE-Bookmark-file-1>\n";
  html +=
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n';
  html += "<TITLE>Bookmarks</TITLE>\n";
  html += "<H1>Bookmarks</H1>\n";
  html += "<DL><p>\n";

  bookmarks.forEach((bookmark) => {
    html += `<DT><A HREF="${bookmark.url}">${bookmark.title}</A>\n`;
  });

  html += "</DL><p>\n";
  return html;
}

export default exportRouter;
