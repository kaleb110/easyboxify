// payment.ts (Express route)
import stripe from "../../util/stripe";
import { Router } from "express";

const paymentRouter = Router();

paymentRouter.post("/", async (req, res) => {
  const { userId, amount } = req.body; // User ID and payment amount (e.g., for a Pro subscription)

  try {
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents (e.g., $10.00 = 1000 cents)
      currency: "usd", // Use your currency
      metadata: { userId }, // Attach user ID for later reference
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret, // Return the client secret to the frontend
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default paymentRouter;
