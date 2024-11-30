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
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const cancelSubscriptionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        // Get user's subscription info
        const user = yield db_1.db
            .select({
            subscriptionId: schema_1.User.subscriptionId,
            stripeCustomerId: schema_1.User.stripeCustomerId,
        })
            .from(schema_1.User)
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, userId))
            .limit(1);
        if (!user.length || !user[0].subscriptionId) {
            return res.status(404).json({ error: "No active subscription found" });
        }
        // Cancel the subscription in Stripe
        const subscription = yield stripe_1.default.subscriptions.update(user[0].subscriptionId, {
            cancel_at_period_end: true,
        });
        // Update user in database with canceling status
        const updatedUser = yield db_1.db
            .update(schema_1.User)
            .set({
            subscriptionStatus: "canceling",
            canceledAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.User.id, userId))
            .returning({
            subscriptionStatus: schema_1.User.subscriptionStatus,
            canceledAt: schema_1.User.canceledAt,
        });
        res.json({
            success: true,
            message: "Subscription will be canceled at the end of the billing period",
            cancelAt: subscription.cancel_at,
            subscriptionStatus: updatedUser[0].subscriptionStatus,
        });
    }
    catch (error) {
        console.error("Error canceling subscription:", error);
        res.status(500).json({
            error: "Failed to cancel subscription",
            message: error.message,
        });
    }
});
exports.default = cancelSubscriptionController;
