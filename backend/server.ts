import express from "express"
import { PORT } from "./config/config"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/route"
import { Application } from "express"

dotenv.config()
const app: Application = express();

app.use('/api', router);
app.use(express.json())
app.use(cors())
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});
