import { errorHandler } from "./middleware/errorHandler";
import express from "express";
import { PORT } from "./config/config";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter";
const cookieParser = require("cookie-parser");
import { Application } from "express";
import userRoutes from "./routes/userRoutes";
import folderRoutes from "./routes/folderRoutes";
import tagRoutes from "./routes/tagRoutes";
import bookmarkRoutes from "./routes/bookmarkRoutes";
import { verifyToken } from "./middleware/authMiddleware";
import webhookRouter from "./routes/stripe/webhookRouter";
import exportRouter from "./routes/exportRouter";
import importRouter from "./routes/importRouter";
import stripeRouter from "./routes/stripe/stripeRouter";
import deleteDataRoutes from "./routes/deleteDataRouter";
dotenv.config();

const app: Application = express();
const isProd = process.env.NODE_ENV === "production";

// Move CORS configuration to the top, right after app initialization
const allowedOrigins = isProd 
  ? ['https://bookmark-manager-liart.vercel.app', 'https://bookmark-manager-jc74.onrender.com']
  : ['http://localhost:3000'];

// app.use(
//   cors({
//     origin: "http://localhost:3000", // Allow requests from this origin
//     methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
//     credentials: true, // If you need cookies/auth headers
//   })
// );
app.use(
  cors({
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// TODO:security in header
app.set("trust proxy", 1);

// payment webhook: does not be parsed
app.use("/webhook", webhookRouter);

app.use(express.json());
app.use(cookieParser());


// security with helmet
app.use(helmet());

// global error handler
app.use(errorHandler);

// authentication routes
app.use("/auth", authRouter);

// user routes
app.use("/api/user", userRoutes);

// payment route
app.use("/", stripeRouter);

// verify this routes with token
app.use(verifyToken);

app.use("/api/folders", folderRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/delete-data", deleteDataRoutes);

// import export bookmarks
app.use("/import", importRouter);
app.use("/export", exportRouter);

// TODO: add role based routes here...

// server listening on port 5000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});
