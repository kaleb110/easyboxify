"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: './drizzle', // Folder where migration files will be output
    schema: './db/schema.ts', // Path to your schema file
    dialect: 'postgresql', // Use PostgreSQL dialect
    dbCredentials: {
        url: process.env.DATABASE_URL, // Use the database URL from the environment
        ssl: { rejectUnauthorized: false }
    },
});
