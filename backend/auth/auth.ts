const nodemailer = require("nodemailer")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import express from "express";
import { google } from "googleapis";
import { db } from "../db";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv"
dotenv.config()

const authRouter = express.Router();

// Registration endpoint
authRouter.post("/register", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Add this line to check the request body content
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).send("Email, password, and role are required");
    }

    // Check if the user already exists
    const existingUserResult = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);

    const existingUser = existingUserResult[0];

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in the database
    const [user] = await db
      .insert(User)
      .values({
        email,
        password: hashedPassword,
        role,
      })
      .returning(); // To get the inserted user

    // Generate a verification token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Send verification email
    const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;
    await sendVerificationEmail(email, verificationLink);

    res.send(
      "Registration successful. Check your email to verify your account."
    );
  } catch (error) {
    console.error("Error during registration:", error.message);
    if (error.stack) console.error("Stack trace:", error.stack);
    res.status(500).send("An error occurred during registration");
  }
});

// Email verification endpoint
authRouter.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userResult = await db
      .select()
      .from(User)
      .where(eq(User.id, decoded.userId))
      .limit(1);

    const user = userResult[0];

    // If user is not found, return an error
    if (!user) return res.status(400).send("Invalid link");

    // Update the user's verified status
    await db
      .update(User)
      .set({ verified: true })
      .where(eq(User.id, decoded.userId));
    res.send("Email verified successfully");
  } catch (error) {
    console.error("Error", error.message)
    res.status(400).send("Invalid or expired token");
  }
});

// Login endpoint
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const userResult = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);

    const user = userResult[0];

    // Check if the user exists and is verified
    if (!user || !user.verified) {
      return res.status(400).send("Invalid email or email not verified");
    }

    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password");

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Send the token as a response
    res.send({ token });
  } catch (error) {
    res.status(500).send("An error occurred during login");
  }
});

authRouter.post("/request-reset-password", async (req, res) => {
  const { email } = req.body;

  // Check if the user exists
  const userResult = await db
    .select()
    .from(User)
    .where(eq(User.email, email))
    .limit(1);
  const user = userResult[0];

  if (!user) return res.status(400).send("user not found");

  // Generate a password reset token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });

  // Save the token in the database (you can create a separate table or store it in the user record)
  await db
    .update(User)
    .set({
      resetToken: token,
      resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
    })
    .where(eq(User.id, user.id));

  // Send reset email
  const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
  await sendPasswordResetEmail(email, resetLink);

  res.send("Password reset email sent. Check your email for instructions.");
})

// Endpoint to reset the password
authRouter.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userResult = await db.select().from(User).where(eq(User.id, decoded.userId)).limit(1);
    const user = userResult[0];

    if (!user || user.resetToken !== token || new Date() > new Date(user.resetTokenExpiry)) {
      return res.status(400).send("Invalid or expired reset token");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database and invalidate the reset token
    await db.update(User).set({ password: hashedPassword, resetToken: null, resetTokenExpiry: null }).where(eq(User.id, user.id));

    res.send("Password reset successful. You can now log in with your new password.");
  } catch (error) {
    res.status(400).send("Invalid or expired reset token");
  }
});


// protected route
authRouter.get("/admin", (req, res) => {
  res.status(200).send("only admin can visit this.");
});

authRouter.get("/user", (req, res) => {
  res.status(200).send("only user can visit this.");
});

// Protected route that requires 'view_dashboard' permission
authRouter.get("/dashboard", (req, res) => {
  res.send("Welcome to the dashboard!");
});

// Protected route that requires 'create_post' permission
authRouter.post("/create-post", (req, res) => {
  res.send("Post created successfully!");
});

// Function to send verification email using OAuth2
async function sendVerificationEmail(email: string, link: string) {
  const OAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  // Set the credentials for OAuth2
  OAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  // Get the access token
  const accessToken = await OAuth2Client.getAccessToken();

  // Set up the transporter using OAuth2 authentication
  let transporter = nodemailer.createTransport({
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

  // Set up the email options
  let mailOptions = {
    from: `Your App <${process.env.EMAIL_USER}>`, // Sender email
    to: email, // Recipient email
    subject: "Verify Your Email", // Email subject
    html: `<h3>Click the link below to verify your email:</h3><a href="${link}">${link}</a>`, // Email content
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

// Function to send password reset email
async function sendPasswordResetEmail(email: string, link: string) {
  const OAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  OAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  const accessToken = await OAuth2Client.getAccessToken();

  let transporter = nodemailer.createTransport({
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

  let mailOptions = {
    from: `Your App <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click the link below to reset your password:</p><a href="${link}">${link}</a>`,
  };

  await transporter.sendMail(mailOptions);
}


export default authRouter;
