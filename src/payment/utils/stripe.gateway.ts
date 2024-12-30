require('dotenv').config();
import Stripe from "stripe";
import { PaymentVO } from "../vo/payment.master.vo";
import { ResponseObject } from "src/shared/types";
import { Injectable } from "@nestjs/common";

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
                amount: payment.amount,
                currency: payment.currency,
                automatic_payment_methods: { enabled: true },
            });

            // return required details
            return {
                status: "success",
                code: 200,
                message: "Payment processed successfully",
                data: {
                    orderId: paymentIntent.id,
                    clientSecret: paymentIntent.client_secret,
                }
            } as ResponseObject
        } catch (error) {
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