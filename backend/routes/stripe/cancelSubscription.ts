import { Router } from "express";
import stripe from "../../util/stripe";
import { db } from "../../db";
import { User } from "../../db/schema";
import { eq } from "drizzle-orm";

const cancelSubscriptionRouter = Router();

cancelSubscriptionRouter.post("/", async (req, res) => {
  const { userId } = req.body;

  try {
    // Get user's subscription info
    const user = await db
      .select({
        subscriptionId: User.subscriptionId,
        stripeCustomerId: User.stripeCustomerId,
      })
      .from(User)
      .where(eq(User.id, userId))
      .limit(1);

    if (!user.length || !user[0].subscriptionId) {
      return res.status(404).json({ error: "No active subscription found" });
    }

    // Cancel the subscription in Stripe
    const subscription = await stripe.subscriptions.update(
      user[0].subscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Update user in database with canceling status
    const updatedUser = await db
      .update(User)
      .set({
        subscriptionStatus: "canceling",
        canceledAt: new Date(),
      })
      .where(eq(User.id, userId))
      .returning({
        subscriptionStatus: User.subscriptionStatus,
        canceledAt: User.canceledAt,
      });

    res.json({
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
      cancelAt: subscription.cancel_at,
      subscriptionStatus: updatedUser[0].subscriptionStatus,
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({
      error: "Failed to cancel subscription",
      message: error.message,
    });
  }
});

export default cancelSubscriptionRouter;
