// webhook.ts (Extended)
import express from "express";
import stripe from "../../util/stripe";
import Stripe from "stripe";
import {handleCheckoutSessionCompleted, handleInvoicePaymentFailed, handleInvoicePaymentSucceeded, handleSubscriptionCreated, handleSubscriptionDeleted, handleSubscriptionUpdated} from "./webhookUtils"
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

    // Handle the event based on its type
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        // Handle checkout session completion (initial payment)
        await handleCheckoutSessionCompleted(session);
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        // Handle successful payment (renewal or initial payment)
        await handleInvoicePaymentSucceeded(invoice);
        break;

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice;
        // Handle failed payment
        await handleInvoicePaymentFailed(failedInvoice);
        break;

      case "customer.subscription.created":
        const subscriptionCreated = event.data.object as Stripe.Subscription;
        // Handle new subscription creation
        await handleSubscriptionCreated(subscriptionCreated);
        break;

      case "customer.subscription.updated":
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        // Handle subscription updates (e.g., plan changes)
        await handleSubscriptionUpdated(subscriptionUpdated);
        break;

      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        // Handle subscription cancellation
        await handleSubscriptionDeleted(subscriptionDeleted);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Acknowledge receipt of the webhook event
    res.json({ received: true });
  }
);


export default webhookRouter;
