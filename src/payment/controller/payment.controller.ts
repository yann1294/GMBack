import { Body, Controller, Inject, Post, RawBodyRequest, Req, Res } from "@nestjs/common";
import { PAYMENT_SERVICE_INTERFACE } from "../token";
import { IPaymentService } from "../services/payment.service.interface";
import { PaymentVO } from "../vo/payment.master.vo";
import { PaymentValidationPipe } from "./payment.validation.pipe";
import Stripe from "stripe";
import * as express from 'express';
import { PaymentWorkflow } from "../utils/payment.workflow";


@Controller('payments')
export class PaymentController {
    private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-12-18.acacia',
      });
    constructor(@Inject(PAYMENT_SERVICE_INTERFACE) private readonly paymentService: IPaymentService,
    private readonly paymentWorkflow: PaymentWorkflow,
  ) {  }

    // @Post()
    // async makePayment(@Body(new PaymentValidationPipe()) payment: PaymentVO): Promise<any> {
    //     console.log("Payment request", payment)
    //     return await this.paymentService.processPayment(payment);
    // }

    @Post()
    async makePayment(@Body(new PaymentValidationPipe()) payment: PaymentVO): Promise<any> {
        console.log("Payment request", payment)
        // Cicéron: Payment service receives data from booking container (booking workflow)
        return await this.paymentWorkflow.executePayment(payment);
    }

    @Post('webhooks/stripe')
  // stripe webhook using express
  async stripeWebhook(@Req() req: RawBodyRequest<express.Request>, @Res() res: express.Response) {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Error verifying Stripe webhook signature:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent was successful!', paymentIntent);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        console.log('PaymentMethod was attached to a Customer!', paymentMethod);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
 
}