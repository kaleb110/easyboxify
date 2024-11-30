"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rateLimiter_1 = require("../middleware/rateLimiter");
const logout_1 = require("../controller/auth/logout");
const refreshTokenHandler_1 = require("../controller/auth/refreshTokenHandler");
const express_1 = __importDefault(require("express"));
const register_1 = __importDefault(require("../controller/auth/register"));
const login_1 = __importDefault(require("../controller/auth/login"));
const emailVerfication_1 = __importDefault(require("../controller/auth/emailVerfication"));
const resetPassword_1 = require("../controller/auth/resetPassword");
const authRouter = express_1.default.Router();
// rate limiter
authRouter.use(rateLimiter_1.limiter);
// Auth routes
authRouter.post("/register", register_1.default);
authRouter.post("/login", login_1.default);
authRouter.post("/logout", logout_1.logoutHandler);
authRouter.post("/verify-email", emailVerfication_1.default);
authRouter.post("/request-reset-password", resetPassword_1.requestPasswordResetHandler);
authRouter.post("/reset-password", resetPassword_1.resetPasswordHandler);
// refresh token router
authRouter.post("/refresh", refreshTokenHandler_1.refreshTokenHandler);
exports.default = authRouter;
