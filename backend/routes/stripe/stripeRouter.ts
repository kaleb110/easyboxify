import Router from "express";
import cancelSubscriptionController from "../../controller/stripe/cancelSubscription";
import checkoutController from "../../controller/stripe/checkout";
import paymentIntentController from "../../controller/stripe/payment";
const stripeRouter = Router();

stripeRouter.post("/cancel-subscription", cancelSubscriptionController);
stripeRouter.post("/create-checkout-session", checkoutController);
// TODO: check if this route is used
stripeRouter.post("/create-payment-intent", paymentIntentController);

export default stripeRouter;
