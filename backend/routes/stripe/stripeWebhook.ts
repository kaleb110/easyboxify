// webhook.ts (Express route)
import express from "express";
import stripe from "../../util/stripe";
import Stripe from "stripe";
import { db } from "../../db";
import { User } from "../../db/schema";
import { eq } from "drizzle-orm";
const webhookRouter = express.Router();

webhookRouter.post(
  "/",
  express.raw({ type: "application/json" }), // This is critical for Stripe webhooks
  async (req, res) => {
    const sig = req.headers["stripe-signature"]; // This is the token header from Stripe
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    if (!sig) {
      console.error("No Stripe signature found in headers.");
      return res.status(400).send("No signature header present.");
    }

    try {
      // Verify webhook signature using the raw body
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Your event handling logic here
    console.log("Webhook event received:", event);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) {
        console.error("No userId found in session metadata.");
        return res.status(400).send("Missing userId in session metadata.");
      }

      try {
        // Update the user's plan in the database
        const updated = await db
          .update(User)
          .set({ plan: "pro" })
          .where(eq(User.id, Number(userId)));

        if (updated) {
          console.log(`User ${userId} successfully upgraded to Pro.`);
        } else {
          console.error(`Failed to update user ${userId} plan.`);
        }
      } catch (dbError) {
        console.error("Database update error:", dbError);
        return res.status(500).send("Database error.");
      }
    }

    res.json({ received: true });
  }
);

export default webhookRouter;
