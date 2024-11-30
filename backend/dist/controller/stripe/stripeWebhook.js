"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("../../config/stripe"));
const webhookHandlers_1 = require("./webhookHandlers");
const webhookController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    if (!sig) {
        console.error("No Stripe signature found in headers.");
        return res.status(400).send("No signature header present.");
    }
    try {
        event = stripe_1.default.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        let response;
        switch (event.type) {
            case "customer.created":
                response = yield (0, webhookHandlers_1.handleCustomerCreated)(event.data.object);
                break;
            case "checkout.session.completed":
                const session = event.data.object;
                response = yield (0, webhookHandlers_1.handleCheckoutSessionCompleted)(session);
                break;
            case "customer.subscription.created":
                response = yield (0, webhookHandlers_1.handleSubscriptionCreated)(event.data.object);
                break;
            case "customer.subscription.updated":
                response = yield (0, webhookHandlers_1.handleSubscriptionUpdated)(event.data.object);
                break;
            case "customer.subscription.deleted":
                response = yield (0, webhookHandlers_1.handleSubscriptionDeleted)(event.data.object);
                break;
            case "invoice.payment_succeeded":
                response = yield (0, webhookHandlers_1.handleInvoicePaymentSucceeded)(event.data.object);
                break;
            case "invoice.payment_failed":
                response = yield (0, webhookHandlers_1.handleInvoicePaymentFailed)(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
                return res.json({ received: true, message: "Unhandled event type" });
        }
        if (!(response === null || response === void 0 ? void 0 : response.success)) {
            console.error(`Error processing ${event.type}:`, response === null || response === void 0 ? void 0 : response.error);
        }
        res.json({ received: true, success: response === null || response === void 0 ? void 0 : response.success });
    }
    catch (error) {
        console.error("Webhook processing error:", error);
        res.status(200).json({ received: true, success: false });
    }
});
exports.default = webhookController;
