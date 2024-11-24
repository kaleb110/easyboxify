import express from "express";
import { PORT } from "./config/config";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./auth/authRouter";
const cookieParser = require("cookie-parser");
import { Application } from "express";
import userRoutes from "./routes/userRoutes";
import folderRoutes from "./routes/folderRoutes";
import tagRoutes from "./routes/tagRoutes";
import bookmarkRoutes from "./routes/bookmarkRoutes";
import verifyToken from "./middleware/verifyToken"

dotenv.config();
const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
    credentials: true, // If you need cookies/auth headers
  })
);

// authentication routes
app.use("/auth", authRouter);

app.use("/api/users", userRoutes);

// verify this routes with token
app.use(verifyToken);

app.use("/api/folders", folderRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

// role based routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});
