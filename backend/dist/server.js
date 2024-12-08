"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("./middleware/errorHandler");
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const cookieParser = require("cookie-parser");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const folderRoutes_1 = __importDefault(require("./routes/folderRoutes"));
const tagRoutes_1 = __importDefault(require("./routes/tagRoutes"));
const bookmarkRoutes_1 = __importDefault(require("./routes/bookmarkRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const webhookRouter_1 = __importDefault(require("./routes/stripe/webhookRouter"));
const exportRouter_1 = __importDefault(require("./routes/exportRouter"));
const importRouter_1 = __importDefault(require("./routes/importRouter"));
const stripeRouter_1 = __importDefault(require("./routes/stripe/stripeRouter"));
const deleteDataRouter_1 = __importDefault(require("./routes/deleteDataRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// payment webhook: does not be parsed
app.use("/webhook", webhookRouter_1.default);
app.use(express_1.default.json());
app.use(cookieParser());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
    credentials: true, // If you need cookies/auth headers
}));
// security with helmet
app.use((0, helmet_1.default)());
// global error handler
app.use(errorHandler_1.errorHandler);
// authentication routes
app.use("/auth", authRouter_1.default);
// user routes
app.use("/api/user", userRoutes_1.default);
// payment route
app.use("/", stripeRouter_1.default);
// verify this routes with token
app.use(authMiddleware_1.verifyToken);
app.use("/api/folders", folderRoutes_1.default);
app.use("/api/tags", tagRoutes_1.default);
app.use("/api/bookmarks", bookmarkRoutes_1.default);
app.use("/api/delete-data", deleteDataRouter_1.default);
// import export bookmarks
app.use("/import", importRouter_1.default);
app.use("/export", exportRouter_1.default);
// TODO: add role based routes here...
// server listening on port 5000
app.listen(config_1.PORT, () => {
    console.log(`Server is running on http://localhost:${config_1.PORT}/api`);
});
