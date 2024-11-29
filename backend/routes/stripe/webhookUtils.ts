import Stripe from "stripe";
import { db } from "../../db";
import { User } from "../../db/schema";
import { eq } from "drizzle-orm";

interface WebhookResponse {
  success: boolean;
  message: string;
  error?: string;
}

export async function handleCustomerCreated(
  customer: Stripe.Customer
): Promise<WebhookResponse> {
  const email = customer.email;
  const stripeCustomerId = customer.id;

  if (!email) {
    console.error("[Stripe Webhook] No email found in customer");
    return {
      success: false,
      message: "No email found",
      error: "MISSING_EMAIL",
    };
  }

  try {
    const result = await db
      .update(User)
      .set({ stripeCustomerId })
      .where(eq(User.email, email))
      .returning({ id: User.id });

    if (!result.length) {
      console.error("[Stripe Webhook] No user found for email:", email);
      return {
        success: false,
        message: "User not found",
        error: "USER_NOT_FOUND",
      };
    }

    console.log("[Stripe Webhook] Customer created and linked:", {
      email,
      stripeCustomerId,
    });
    return { success: true, message: "Customer linked successfully" };
  } catch (error) {
    console.error("[Stripe Webhook] Customer Creation Error:", {
      error,
      email,
    });
    return {
      success: false,
      message: "Failed to link customer",
      error: "DATABASE_ERROR",
    };
  }
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<WebhookResponse> {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;

  if (!userId) {
    console.error("[Stripe Webhook] No userId found in session metadata");
    return {
      success: false,
      message: "No userId found",
      error: "MISSING_USER_ID",
    };
  }

  try {
    const result = await db
      .update(User)
      .set({
        plan: "pro",
        lastPaymentStatus: "succeeded",
        stripeCustomerId: customerId, // Ensure customer ID is set
      })
      .where(eq(User.id, Number(userId)))
      .returning({ id: User.id });

    if (!result.length) {
      return {
        success: false,
        message: "User not found",
        error: "USER_NOT_FOUND",
      };
    }

    console.log("[Stripe Webhook] Checkout completed:", { userId, customerId });
    return { success: true, message: "Subscription activated successfully" };
  } catch (error) {
    console.error("[Stripe Webhook] Checkout Error:", { error, userId });
    return {
      success: false,
      message: "Failed to update subscription",
      error: "DATABASE_ERROR",
    };
  }
}

export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<WebhookResponse> {
  const customerId = subscription.customer as string;

  try {
    const user = await db
      .select()
      .from(User)
      .where(eq(User.stripeCustomerId, customerId))
      .limit(1);

    if (!user.length) {
      console.error("[Stripe Webhook] No user found for customer:", customerId);
      return {
        success: false,
        message: "User not found",
        error: "USER_NOT_FOUND",
      };
    }

    const userId = user[0].id;

    await db
      .update(User)
      .set({
        plan: "pro",
        subscriptionStatus: subscription.status,
        subscriptionId: subscription.id,
        canceledAt: null,
      })
      .where(eq(User.id, userId));

    console.log("[Stripe Webhook] Subscription created:", {
      userId,
      customerId,
    });
    return { success: true, message: "Subscription created successfully" };
  } catch (error) {
    console.error("[Stripe Webhook] Subscription Creation Error:", {
      error,
      customerId,
    });
    return {
      success: false,
      message: "Failed to create subscription",
      error: "SUBSCRIPTION_ERROR",
    };
  }
}

// when a subscription choice is updated
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<WebhookResponse> {
  const customerId = subscription.customer as string;
  const userId = await getUserIdByStripeCustomerId(customerId);

  if (!userId) {
    console.error("[Stripe Webhook] No user found for customer:", customerId);
    return {
      success: false,
      message: "User not found",
      error: "USER_NOT_FOUND",
    };
  }

  // Here we handle different subscription statuses (e.g., active, past_due, canceled)
  let plan = "free"; // Default to free
  if (subscription.status === "active") {
    plan = "pro"; // Set to pro if the subscription is active
  } else if (
    subscription.status === "canceled" ||
    subscription.status === "unpaid"
  ) {
    plan = "free"; // Set to free if the subscription is canceled or unpaid
  }

  try {
    await db
      .update(User)
      .set({
        subscriptionStatus: subscription.status,
        subscriptionId: subscription.id,
        plan, // Update the user's plan based on the subscription status
      })
      .where(eq(User.id, Number(userId)));

    return { success: true, message: "Subscription updated successfully" };
  } catch (error) {
    console.error("[Stripe Webhook] Subscription Update Error:", {
      error,
      userId,
    });
    return {
      success: false,
      message: "Failed to update subscription",
      error: "SUBSCRIPTION_UPDATE_ERROR",
    };
  }
}

// Function to handle subscription deletion/cancellation or when the user cancels subscription
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<WebhookResponse> {
  const customerId = subscription.customer as string;
  const userId = await getUserIdByStripeCustomerId(customerId);

  if (!userId) {
    console.error("[Stripe Webhook] No user found for customer:", customerId);
    return {
      success: false,
      message: "User not found",
      error: "USER_NOT_FOUND",
    };
  }

  try {
    await db
      .update(User)
      .set({
        plan: "free",
        subscriptionStatus: "canceled",
        subscriptionId: null,
        canceledAt: new Date(),
      })
      .where(eq(User.id, Number(userId)));

    return { success: true, message: "Subscription canceled successfully" };
  } catch (error) {
    console.error("[Stripe Webhook] Subscription Deletion Error:", {
      error,
      userId,
    });
    return {
      success: false,
      message: "Failed to cancel subscription",
      error: "CANCELLATION_ERROR",
    };
  }
}

// function to renew or update subscription monthly or yearly
export async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<WebhookResponse> {
  const customerId = invoice.customer as string;
  const userId = await getUserIdByStripeCustomerId(customerId);

  if (!userId) {
    console.error("[Stripe Webhook] No user found for customer:", customerId);
    return {
      success: false,
      message: "User not found",
      error: "USER_NOT_FOUND",
    };
  }

  try {
    await db
      .update(User)
      .set({
        lastPaymentStatus: "succeeded",
        plan: "pro", // Ensure the user gets the correct plan (this may depend on the subscription status)
      })
      .where(eq(User.id, Number(userId)));

    return { success: true, message: "Payment successful and user updated" };
  } catch (error) {
    console.error("[Stripe Webhook] Payment Success Error:", { error, userId });
    return {
      success: false,
      message: "Failed to update payment status",
      error: "PAYMENT_SUCCESS_ERROR",
    };
  }
}

// Function to handle failed payments
export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<WebhookResponse> {
  const customerId = invoice.customer as string;
  const userId = await getUserIdByStripeCustomerId(customerId);

  if (!userId) {
    console.error("[Stripe Webhook] No user found for customer:", customerId);
    return {
      success: false,
      message: "User not found",
      error: "USER_NOT_FOUND",
    };
  }

  try {
    await db
      .update(User)
      .set({
        lastPaymentStatus: "failed",
      })
      .where(eq(User.id, Number(userId)));

    return { success: true, message: "Payment failure recorded" };
  } catch (error) {
    console.error("[Stripe Webhook] Payment Failure Error:", { error, userId });
    return {
      success: false,
      message: "Failed to update payment status",
      error: "PAYMENT_ERROR",
    };
  }
}

// function to handle renewal payment cancelation or when the users cancels renew payment
export async function handleInvoicePaymentCanceled(
  invoice: Stripe.Invoice
): Promise<WebhookResponse> {
  const customerId = invoice.customer as string;
  const userId = await getUserIdByStripeCustomerId(customerId);

  if (!userId) {
    console.error("[Stripe Webhook] No user found for customer:", customerId);
    return {
      success: false,
      message: "User not found",
      error: "USER_NOT_FOUND",
    };
  }

  try {
    await db
      .update(User)
      .set({
        lastPaymentStatus: "canceled",
      })
      .where(eq(User.id, Number(userId)));

    return { success: true, message: "Payment cancellation recorded" };
  } catch (error) {
    console.error("[Stripe Webhook] Payment Cancellation Error:", {
      error,
      userId,
    });
    return {
      success: false,
      message: "Failed to update payment status",
      error: "PAYMENT_CANCELLATION_ERROR",
    };
  }
}

// Helper function to get user ID from Stripe customer ID
export async function getUserIdByStripeCustomerId(
  customerId: string
): Promise<string | null> {
  if (!customerId) return null;

  try {
    const user = await db
      .select()
      .from(User)
      .where(eq(User.stripeCustomerId, customerId))
      .limit(1);

    return user.length ? user[0].id.toString() : null;
  } catch (error) {
    console.error("[Stripe Webhook] Error fetching user:", {
      error,
      customerId,
    });
    return null;
  }
}
