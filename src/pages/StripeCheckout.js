import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import "../Stripe.css";
import { useSelector } from "react-redux";
import { selectCurrentOrder } from "../features/order/orderSlice";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51QfCcrGf7SnLlymcnHmXhMBiSltgtHrQYQDOQx1pQ8QMXiAENmhbOjn84DLfn2qKqgZNFfLfjXzmV76ioLDCoxa500A87jtRUq");

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
 const currentOrder = useSelector(selectCurrentOrder);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalAmount: currentOrder.totalAmount }),
      meta:{
        order_id:currentOrder.id // this info will go to stripe => and then to our webhook
        // so we can conclude that payment was successful, even if client closes window after pay
      }
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: 'stripe'
    };
  
  const options = {
    clientSecret,
    appearance
  }
  // Enable the skeleton loader UI for optimal loading.
  const loader = 'auto';

  return (

      <div className="Stripe">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>

  );
}