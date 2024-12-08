"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
const nodemailer = require("nodemailer");
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Common function to create a transporter
const createTransporter = async () => {
    const OAuth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
    OAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    const accessToken = await OAuth2Client.getAccessToken();
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken.token,
        },
    });
};
// Function to send verification email
const sendVerificationEmail = async (email, link) => {
    const transporter = await createTransporter();
    const mailOptions = {
        from: `Your App <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email",
        html: `<h3>Click the link below to verify your email:</h3><a href="${link}">${link}</a>`,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendVerificationEmail = sendVerificationEmail;
// Function to send password reset email
const sendPasswordResetEmail = async (email, link) => {
    const transporter = await createTransporter();
    const mailOptions = {
        from: `Your App <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset",
        html: `<h3>Click the link below to reset your password:</h3><a href="${link}">${link}</a>`,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
