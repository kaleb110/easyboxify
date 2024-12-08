"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message || err); // Log the error
    res.status(err.status || 500).json({
        message: err.message || "An unexpected error occurred",
    });
};
exports.errorHandler = errorHandler;
