import { Injectable, InternalServerErrorException } from "@nestjs/common";
import Stripe from "stripe";
import { PaymentVO } from "../vo/payment.master.vo";
import { ResponseObject } from "src/shared/types";
import { paymentMethodTypes } from "./stripe-methods.utils";
import { DataService } from "src/shared/services/data.service";
require('dotenv').config();

@Injectable()
export class StripeGateway {
  private readonly stripe: Stripe;

  constructor(
    private readonly dataService: DataService
  ) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new InternalServerErrorException("Stripe secret key is not configured.");
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
    });
  }

  async processPayment(payment: PaymentVO): Promise<{session: Stripe.Response<Stripe.Checkout.Session>, payment: PaymentVO} | ResponseObject> {
    try {
      // Fetch product details
      const response: ResponseObject = await this.dataService.readDoc(payment.resourceType, payment.resourceId);
      
      // check whether tour is available
      if (response.status !== "success") return response;

      // Ensure amount is rounded to two decimal places and converted to cents
      const amountInCents = parseFloat(payment.amount.toFixed(2)) * 100;
  
      // Create a checkout session
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'], // Replace with actual types if needed
        line_items: [
          {
            price_data: {
              currency: payment.currency,
              product_data: {
                name: response.data['name'],
                description: response.data['description'],
                images: (response.data['images'] as string[]).slice(0, 8),
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/booking/success`,
        cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`,
      });
  
      // update payment id and status
      payment.sessionId = session.id;
      payment.status = "in-progress";
      console.log(payment)

      // Return successful response
      return {
        session: session,
        payment: payment 
      };
    } catch (error) {
      console.error("Error creating session:", error);
  
      // Return error response
      return {
        status: "failure",
        code: error.statusCode || 500,
        message: error.message || "An error occurred while creating the session",
        data: null,
      };
    }
  }
  
  async refundPayment(paymentId: string): Promise<ResponseObject> {
    try {
      // Refund the payment
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentId,
      });

      // Return successful refund response
      return {
        status: "success",
        code: 200,
        message: "Payment refunded successfully",
        data: refund,
      };
    } catch (error) {
      console.error("Error processing refund:", error);

      // Return error response
      return {
        status: "failure",
        code: error.statusCode || 500,
        message: error.message || "An error occurred while processing the refund",
        data: null,
      };
    }
  }
}
