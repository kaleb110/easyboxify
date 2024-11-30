"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = __importDefault(require("express"));
const stripeWebhook_1 = __importDefault(require("../../controller/stripe/stripeWebhook"));
const webhookRouter = (0, express_1.default)();
webhookRouter.post("/", express_2.default.raw({ type: "application/json" }), stripeWebhook_1.default);
exports.default = webhookRouter;
