"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cancelSubscription_1 = __importDefault(require("../../controller/stripe/cancelSubscription"));
const checkout_1 = __importDefault(require("../../controller/stripe/checkout"));
const payment_1 = __importDefault(require("../../controller/stripe/payment"));
const stripeRouter = (0, express_1.default)();
stripeRouter.post("/cancel-subscription", cancelSubscription_1.default);
stripeRouter.post("/create-checkout-session", checkout_1.default);
// TODO: check if this route is used
stripeRouter.post("/create-payment-intent", payment_1.default);
exports.default = stripeRouter;
