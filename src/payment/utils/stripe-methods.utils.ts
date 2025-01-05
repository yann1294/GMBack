import Stripe from "stripe";

export const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = [
    'card',            // Credit and debit cards (Visa, MasterCard, etc.)
    // 'paypal',          // PayPal (Global)
  ];
  