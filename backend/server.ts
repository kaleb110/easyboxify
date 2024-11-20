import express from "express"
import { PORT } from "./config/config"
import cors from "cors"
import dotenv from "dotenv"
import authRouter from "./auth/authRouter"
const cookieParser = require("cookie-parser")
import { Application } from "express"
import userRoutes from "./routes/userRoutes"
import folderRoutes from "./routes/folderRoutes"
import tagRoutes from "./routes/tagRoutes"
import bookmarkRoutes from "./routes/bookmarkRoutes"

dotenv.config()
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
app.use("/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});
