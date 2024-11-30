import Router from "express";
import cancelSubscriptionController from "../../controller/stripe/cancelSubscription";
import checkoutController from "../../controller/stripe/checkout";
import paymentController from "../../controller/stripe/payment";
const stripeRouter = Router();

stripeRouter.post("/cancel-subscription", cancelSubscriptionController);
stripeRouter.post("/create-checkout-session", checkoutController);
stripeRouter.post("/create-payment-intent", paymentController);

export default stripeRouter;
