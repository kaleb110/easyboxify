// payment.ts (Express route)
import stripe from "../../config/stripe";
import { Request, Response } from "express";

const paymentController = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default paymentController;
