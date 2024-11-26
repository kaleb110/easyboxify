import Router from "express";
import stripe from "../../util/stripe";

const checkoutRouter = Router();

checkoutRouter.post("/", async (req, res) => {
  const { userId } = req.body; // Assuming the user ID is sent in the request

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pro Plan",
              description: "Upgrade to the Pro plan for unlimited features.",
            },
            unit_amount: 1000, // $10.00 in cents
          },
          quantity: 1,
        },
      ],
      metadata: { userId }, // Pass user ID for later use in webhook
      success_url: `${process.env.BASE_URL}/success`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default checkoutRouter;
