require('dotenv').config();
import Stripe from "stripe";
import { PaymentVO } from "../vo/payment.master.vo";
import { ResponseObject } from "src/shared/types";
import { Injectable } from "@nestjs/common";
import { paymentMethodTypes } from "./stripe-methods.utils";

@Injectable()
export class StripeGateway {
    private readonly stripe: Stripe;
    constructor() { 
       this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2024-12-18.acacia",
        });
    }
    async processPayment(payment: PaymentVO): Promise<ResponseObject> {
        try {
            // Logic to process payment using Stripe API
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: parseFloat((payment.amount).toFixed(2)) * 100,
                currency: payment.currency,
                automatic_payment_methods: { enabled: true },
            });

            // create checkout session
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: paymentMethodTypes,
                line_items: [
                  {
                    price_data: {
                      currency: 'usd',
                      product_data: {
                        name: 'Order #' + paymentIntent.id,
                      },
                      unit_amount: payment.amount * 100, // Amount in cents (e.g. 20 USD)
                    },
                    quantity: 1,
                  },
                ],
                mode: 'payment', // You can also use 'subscription' if needed
                success_url: `${process.env.FRONTEND_URL}/booking/success`, // Redirect to success page after payment
                cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`, // Redirect to cancel page if user cancels payment
                metadata: {
                  orderId: paymentIntent.id,
                  clientSecret: paymentIntent.client_secret,
                },
              });

            // return required details
            return {
                status: "success",
                code: 200,
                message: "Payment processed successfully",
                data: session
            } as ResponseObject
        } catch (error) {
            console.log(error)
            return {
                status: "failure",
                code: error.statusCode,
                message: error.message,
                data: null
            } as ResponseObject
        }
    }

    async refundPayment(paymentId: string): Promise<string> {
        // Logic to refund payment using Stripe API
        // For example, you might use the Stripe SDK here
        // const refund = await stripe.refunds.create({
        //   payment_intent: paymentId,
        // });

        // Simulating a payment refund
        return 'stripe-refund-id';
    }
}