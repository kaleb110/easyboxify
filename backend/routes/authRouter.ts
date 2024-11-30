import { limiter } from "../middleware/rateLimiter";
import { logoutHandler } from "../controller/auth/logout";
import { refreshTokenHandler } from "../controller/auth/refreshTokenHandler";
import express from "express";
import registerHandler from "../controller/auth/register";
import loginHandler from "../controller/auth/login";
import verifyEmailHandler from "../controller/auth/emailVerfication";
import {
  requestPasswordResetHandler,
  resetPasswordHandler,
} from "../controller/auth/resetPassword";
const authRouter = express.Router();

// rate limiter
authRouter.use(limiter);

// Auth routes
authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.post("/verify-email", verifyEmailHandler);
authRouter.post("/request-reset-password", requestPasswordResetHandler);
authRouter.post("/reset-password", resetPasswordHandler);

// refresh token router

authRouter.post("/refresh", refreshTokenHandler);

export default authRouter;
