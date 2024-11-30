import stripe from "../../config/stripe";
import Stripe from "stripe";
import { Request, Response } from "express";
import {
  handleCheckoutSessionCompleted,
  handleInvoicePaymentFailed,
  handleInvoicePaymentSucceeded,
  handleSubscriptionCreated,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
  handleCustomerCreated,
} from "../../util/webhookUtils";

const webhookController = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  if (!sig) {
    console.error("No Stripe signature found in headers.");
    return res.status(400).send("No signature header present.");
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    let response;

    switch (event.type) {
      case "customer.created":
        response = await handleCustomerCreated(
          event.data.object as Stripe.Customer
        );
        break;

      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        response = await handleCheckoutSessionCompleted(session);
        break;

      case "customer.subscription.created":
        response = await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        response = await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        response = await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_succeeded":
        response = await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.payment_failed":
        response = await handleInvoicePaymentFailed(
          event.data.object as Stripe.Invoice
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
        return res.json({ received: true, message: "Unhandled event type" });
    }

    if (!response?.success) {
      console.error(`Error processing ${event.type}:`, response?.error);
    }

    res.json({ received: true, success: response?.success });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(200).json({ received: true, success: false });
  }
};

export default webhookController;
