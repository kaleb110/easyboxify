import Stripe from "stripe";
import { db } from "../../db";
import { User } from "../../db/schema";
import { eq } from "drizzle-orm";

// Function to handle Checkout Session completion (initial payment)
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId;

  if (!userId) {
    console.error("No userId found in session metadata.");
    return;
  }

  try {
    // Update the user's plan to "pro" in the database
    const updated = await db
      .update(User)
      .set({ plan: "pro" })
      .where(eq(User.id, Number(userId)));

    if (updated) {
      console.log(`User ${userId} successfully upgraded to Pro.`);
    } else {
      console.error(`Failed to update user ${userId} plan.`);
    }
  } catch (error) {
    console.error("Database update error:", error);
  }
}

// Function to handle successful payment (renewal or initial payment)
export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer;
  const userId = await getUserIdByStripeCustomerId(customerId);

  if (!userId) {
    console.error("User not found for customer ID:", customerId);
    return;
  }

  try {
    // Update user's plan to "pro" if not already set (handle renewals)
    const updated = await db
      .update(User)
      .set({ plan: "pro" })
      .where(eq(User.id, Number(userId)));

    if (updated) {
      console.log(`User ${userId} payment succeeded and plan is confirmed.`);
    } else {
      console.error(`Failed to update user ${userId} plan after payment.`);
    }
  } catch (error) {
    console.error("Database update error on payment succeeded:", error);
  }
}

// Function to handle new subscription creation
export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer;
  const userId = await getUserIdByStripeCustomerId(customerId);

  if (!userId) {
    console.error("User not found for customer ID:", customerId);
    return;
  }

  try {
    // Update user's plan to "pro"
    const updated = await db
      .update(User)
      .set({ plan: "pro" })
      .where(eq(User.id, Number(userId)));

    if (updated) {
      console.log(`User ${userId} subscription created successfully.`);
    } else {
      console.error(
        `Failed to update user ${userId} plan on subscription creation.`
      );
    }
  } catch (error) {
    console.error("Database update error on subscription creation:", error);
  }
}

// Function to handle subscription updates (e.g., plan changes)
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer;
  const userId = await getUserIdByStripeCustomerId(customerId);
  const planStatus = subscription.status;

  if (!userId) {
    console.error("User not found for customer ID:", customerId);
    return;
  }

  try {
    // Check subscription status and update user plan accordingly
    const planType = planStatus === "active" ? "pro" : "free";

    const updated = await db
      .update(User)
      .set({ plan: planType })
      .where(eq(User.id, Number(userId)));

    if (updated) {
      console.log(`User ${userId} subscription updated to ${planType}.`);
    } else {
      console.error(
        `Failed to update user ${userId} plan on subscription update.`
      );
    }
  } catch (error) {
    console.error("Database update error on subscription update:", error);
  }
}

// Function to handle subscription cancellation
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer;
  const userId = await getUserIdByStripeCustomerId(customerId);

  if (!userId) {
    console.error("User not found for customer ID:", customerId);
    return;
  }

  try {
    // Downgrade the user to "free" plan upon subscription cancellation
    const updated = await db
      .update(User)
      .set({ plan: "free" })
      .where(eq(User.id, Number(userId)));

    if (updated) {
      console.log(`User ${userId} subscription canceled, downgraded to Free.`);
    } else {
      console.error(
        `Failed to downgrade user ${userId} on subscription cancellation.`
      );
    }
  } catch (error) {
    console.error("Database update error on subscription deletion:", error);
  }
}

// Function to handle failed payments
export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer;
  const userId = await getUserIdByStripeCustomerId(customerId);

  if (!userId) {
    console.error("User not found for customer ID:", customerId);
    return;
  }

  try {
    // Notify the user or take action on failed payment (log it)
    console.warn(
      `Payment failed for User ${userId}. Consider notifying the user.`
    );
    // Optionally, add a warning or a retry logic in your system.
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}

// Helper function to get user ID from Stripe customer ID
export async function getUserIdByStripeCustomerId(
  customerId: string
): Promise<string | null> {
  try {
    const user = await db
      .select()
      .from(User)
      .where(eq(User.stripeCustomerId, customerId))
      .limit(1);

    return user.length > 0 ? user[0].id.toString() : null;
  } catch (error) {
    console.error("Error fetching user by Stripe customer ID:", error);
    return null;
  }
}
