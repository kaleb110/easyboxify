"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// payment.ts (Express route)
const stripe_1 = __importDefault(require("../../config/stripe"));
const paymentIntentController = async (req, res) => {
    const { userId, amount } = req.body; // User ID and payment amount (e.g., for a Pro subscription)
    try {
        // Create a PaymentIntent
        const paymentIntent = await stripe_1.default.paymentIntents.create({
            amount, // Amount in cents (e.g., $10.00 = 1000 cents)
            currency: "usd", // Use your currency
            metadata: { userId }, // Attach user ID for later reference
        });
        res.status(200).send({
            clientSecret: paymentIntent.client_secret, // Return the client secret to the frontend
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.default = paymentIntentController;
