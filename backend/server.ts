import express from "express"
import { PORT } from "./config/config"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/route"
import authRouter from "./auth/authRouter"
const cookieParser = require("cookie-parser")
import { Application } from "express"

dotenv.config()
const app: Application = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
    credentials: true, // If you need cookies/auth headers
  })
);
app.use(express.json())
app.use('/api', router);
app.use("/auth", authRouter);
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});
