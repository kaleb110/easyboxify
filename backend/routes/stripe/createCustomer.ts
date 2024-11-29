import Stripe from "stripe";
import { db } from "../../db"; // Adjust the path as needed
import { User } from "../../db/schema"; // Adjust the path as needed
import { eq } from "drizzle-orm";
import stripe from "../../util/stripe";

// Function to create a Stripe customer and associate it with a user in the database
export const createCustomer = async (user: { id: number; email: string }) => {
  try {
    // Create a Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id.toString() },
    });

    // Update the database with the Stripe customer ID
    await db
      .update(User)
      .set({ stripeCustomerId: customer.id })
      .where(eq(User.id, user.id));

    console.log(`Stripe customer created and linked for User ID: ${user.id}`);
    return customer;
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw error;
  }
};
