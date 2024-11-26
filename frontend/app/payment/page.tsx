"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axiosClient from "@/util/axiosClient";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  // Add a loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe or Elements not loaded.");
      return;
    }

    // Disable button while processing
    setIsLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        console.error("CardElement not found.");
        setIsLoading(false);
        return;
      }

      // Send payment information to the backend
      const response = await axiosClient.post("/create-payment-intent", {
        userId: 18,
        amount: 100, // Amount in cents
      });

      const { clientSecret } = response.data;

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.error("Payment failed:", error);
      } else if (paymentIntent?.status === "succeeded") {
        console.log("Payment successful!");
        // Redirect or update the user to Pro
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      // Re-enable the button
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}
