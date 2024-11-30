// checkout.ts
import stripe from "../../config/stripe";
import dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config();

const checkoutController = async (req: Request, res: Response) => {
  const { userId, planType } = req.body; // Assuming the user ID is sent in the request

  // Use the correct price ID based on the selected plan type
  const priceId =
    planType === "yearly"
      ? process.env.STRIPE_YEARLY_PRICE_ID // Use the yearly price ID
      : process.env.STRIPE_MONTHLY_PRICE_ID; // Use the monthly price ID

  try {
    const session = await stripe.checkout.sessions.create({
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
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default checkoutController;
