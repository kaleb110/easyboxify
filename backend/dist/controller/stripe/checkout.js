"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// checkout.ts
const stripe_1 = __importDefault(require("../../config/stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const checkoutController = async (req, res) => {
    const { userId, planType } = req.body; // Assuming the user ID is sent in the request
    // Use the correct price ID based on the selected plan type
    const priceId = planType === "yearly"
        ? process.env.STRIPE_YEARLY_PRICE_ID // Use the yearly price ID
        : process.env.STRIPE_MONTHLY_PRICE_ID; // Use the monthly price ID
    try {
        const session = await stripe_1.default.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                {
                    price: priceId, // Use the correct Stripe price ID
                    quantity: 1,
                },
            ],
            metadata: { userId }, // Pass user ID for later use in webhook
            success_url: `${process.env.BASE_URL}/success`,
            cancel_url: `${process.env.BASE_URL}/cancel`,
        });
        res.json({ url: session.url });
    }
    catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.default = checkoutController;
