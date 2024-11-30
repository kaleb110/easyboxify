"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutHandler = void 0;
const logoutHandler = (req, res) => {
    res.clearCookie("refreshToken", { path: "/" }); // Clear the refresh token cookie
    return res.status(200).json({ message: "Logged out successfully" });
};
exports.logoutHandler = logoutHandler;
