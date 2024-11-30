"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// payment.ts (Express route)
const stripe_1 = __importDefault(require("../../config/stripe"));
const paymentIntentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, amount } = req.body; // User ID and payment amount (e.g., for a Pro subscription)
    try {
        // Create a PaymentIntent
        const paymentIntent = yield stripe_1.default.paymentIntents.create({
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
});
exports.default = paymentIntentController;
