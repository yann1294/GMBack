import Stripe from "stripe";

export const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = [
  'card'
];
