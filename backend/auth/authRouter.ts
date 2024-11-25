import { limiter } from './../middleware/rateLimiter';
import { logoutHandler } from './logout';
import { refreshTokenHandler } from './refreshTokenHandler';
import express from "express";
import registerHandler from "./register";
import loginHandler from "./login";
import verifyEmailHandler from "./emailVerfication";
import {
  requestPasswordResetHandler,
  resetPasswordHandler,
} from "./resetPassword";
import { authMiddleware } from "./middleware/authMiddleware";
import { checkRole } from "./middleware/roleMiddleware";
const authRouter = express.Router();

// rate limiter

authRouter.use(limiter)
// Auth routes
authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);
authRouter.post("/verify-email", verifyEmailHandler);
authRouter.post("/request-reset-password", requestPasswordResetHandler);
authRouter.post("/reset-password", resetPasswordHandler);

// refresh token router

authRouter.post("/refresh", refreshTokenHandler);

// Example of protected routes
authRouter.get("/admin", authMiddleware, checkRole("Admin"), (req, res) => {
  res.status(200).send("Only admin can visit this.");
});

authRouter.get("/user", authMiddleware, checkRole("User"), (req, res) => {
  res.status(200).send("Only user can visit this.");
});

export default authRouter;
