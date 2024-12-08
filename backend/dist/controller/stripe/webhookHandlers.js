"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCustomerCreated = handleCustomerCreated;
exports.handleCheckoutSessionCompleted = handleCheckoutSessionCompleted;
exports.handleSubscriptionCreated = handleSubscriptionCreated;
exports.handleSubscriptionUpdated = handleSubscriptionUpdated;
exports.handleSubscriptionDeleted = handleSubscriptionDeleted;
exports.handleInvoicePaymentSucceeded = handleInvoicePaymentSucceeded;
exports.handleInvoicePaymentFailed = handleInvoicePaymentFailed;
exports.handleInvoicePaymentCanceled = handleInvoicePaymentCanceled;
exports.getUserIdByStripeCustomerId = getUserIdByStripeCustomerId;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function handleCustomerCreated(customer) {
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
        const result = await db_1.db
            .update(schema_1.User)
            .set({ stripeCustomerId })
            .where((0, drizzle_orm_1.eq)(schema_1.User.email, email))
            .returning({ id: schema_1.User.id });
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
    }
    catch (error) {
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
async function handleCheckoutSessionCompleted(session) {
    const userId = session.metadata?.userId;
    const customerId = session.customer;
    if (!userId) {
        console.error("[Stripe Webhook] No userId found in session metadata");
        return {
            success: false,
            message: "No userId found",
            error: "MISSING_USER_ID",
        };
    }
    try {
        const result = await db_1.db
            .update(schema_1.User)
            .set({
            plan: "pro",
            lastPaymentStatus: "succeeded",
            stripeCustomerId: customerId, // Ensure customer ID is set
        })
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, Number(userId)))
            .returning({ id: schema_1.User.id });
        if (!result.length) {
            return {
                success: false,
                message: "User not found",
                error: "USER_NOT_FOUND",
            };
        }
        console.log("[Stripe Webhook] Checkout completed:", { userId, customerId });
        return { success: true, message: "Subscription activated successfully" };
    }
    catch (error) {
        console.error("[Stripe Webhook] Checkout Error:", { error, userId });
        return {
            success: false,
            message: "Failed to update subscription",
            error: "DATABASE_ERROR",
        };
    }
}
async function handleSubscriptionCreated(subscription) {
    const customerId = subscription.customer;
    try {
        const user = await db_1.db
            .select()
            .from(schema_1.User)
            .where((0, drizzle_orm_1.eq)(schema_1.User.stripeCustomerId, customerId))
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
        await db_1.db
            .update(schema_1.User)
            .set({
            plan: "pro",
            subscriptionStatus: subscription.status,
            subscriptionId: subscription.id,
            canceledAt: null,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, userId));
        console.log("[Stripe Webhook] Subscription created:", {
            userId,
            customerId,
        });
        return { success: true, message: "Subscription created successfully" };
    }
    catch (error) {
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
async function handleSubscriptionUpdated(subscription) {
    const customerId = subscription.customer;
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
    }
    else if (subscription.status === "canceled" ||
        subscription.status === "unpaid") {
        plan = "free"; // Set to free if the subscription is canceled or unpaid
    }
    try {
        await db_1.db
            .update(schema_1.User)
            .set({
            subscriptionStatus: subscription.status,
            subscriptionId: subscription.id,
            plan, // Update the user's plan based on the subscription status
        })
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, Number(userId)));
        return { success: true, message: "Subscription updated successfully" };
    }
    catch (error) {
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
async function handleSubscriptionDeleted(subscription) {
    const customerId = subscription.customer;
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
        await db_1.db
            .update(schema_1.User)
            .set({
            plan: "free",
            subscriptionStatus: "canceled",
            subscriptionId: null,
            canceledAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, Number(userId)));
        return { success: true, message: "Subscription canceled successfully" };
    }
    catch (error) {
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
async function handleInvoicePaymentSucceeded(invoice) {
    const customerId = invoice.customer;
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
        await db_1.db
            .update(schema_1.User)
            .set({
            lastPaymentStatus: "succeeded",
            plan: "pro", // Ensure the user gets the correct plan (this may depend on the subscription status)
        })
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, Number(userId)));
        return { success: true, message: "Payment successful and user updated" };
    }
    catch (error) {
        console.error("[Stripe Webhook] Payment Success Error:", { error, userId });
        return {
            success: false,
            message: "Failed to update payment status",
            error: "PAYMENT_SUCCESS_ERROR",
        };
    }
}
// TODO: check on this function
// Function to handle failed payments
async function handleInvoicePaymentFailed(invoice) {
    const customerId = invoice.customer;
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
        await db_1.db
            .update(schema_1.User)
            .set({
            lastPaymentStatus: "failed",
        })
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, Number(userId)));
        return { success: true, message: "Payment failure recorded" };
    }
    catch (error) {
        console.error("[Stripe Webhook] Payment Failure Error:", { error, userId });
        return {
            success: false,
            message: "Failed to update payment status",
            error: "PAYMENT_ERROR",
        };
    }
}
// function to handle renewal payment cancelation or when the users cancels renew payment
async function handleInvoicePaymentCanceled(invoice) {
    const customerId = invoice.customer;
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
        await db_1.db
            .update(schema_1.User)
            .set({
            lastPaymentStatus: "canceled",
        })
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, Number(userId)));
        return { success: true, message: "Payment cancellation recorded" };
    }
    catch (error) {
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
async function getUserIdByStripeCustomerId(customerId) {
    if (!customerId)
        return null;
    try {
        const user = await db_1.db
            .select()
            .from(schema_1.User)
            .where((0, drizzle_orm_1.eq)(schema_1.User.stripeCustomerId, customerId))
            .limit(1);
        return user.length ? user[0].id.toString() : null;
    }
    catch (error) {
        console.error("[Stripe Webhook] Error fetching user:", {
            error,
            customerId,
        });
        return null;
    }
}
