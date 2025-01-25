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
    async stripeWebhook(
      @Req() req: RawBodyRequest<express.Request>,
      @Res() res: express.Response
    ) {
      // Retrieve the Stripe signature from the headers
      const sig = req.headers['stripe-signature'];
      let event: Stripe.Event;
  
      try {
        // Construct the Stripe event using the raw body and signature
        event = this.stripe.webhooks.constructEvent(
          req.rawBody,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        // Log the error if webhook verification fails
        console.error('Error verifying Stripe webhook signature:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
  
      // Handle the event based on its type
      switch (event.type) {
        case 'payment_intent.succeeded':
          // Handle successful payment intent
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('PaymentIntent was successful!', paymentIntent);
          break;
        case 'payment_intent.payment_failed':
          // Handle failed payment intent
          const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('PaymentIntent failed!', failedPaymentIntent);
          break;
        case 'payment_method.attached':
          // Handle payment method attachment to a customer
          const paymentMethod = event.data.object as Stripe.PaymentMethod;
          console.log('PaymentMethod was attached to a Customer!', paymentMethod);
          break;
        case 'charge.succeeded':
          // Handle successful charge
          const charge = event.data.object as Stripe.Charge;
          console.log('Charge succeeded!', charge);
          break;
        case 'charge.failed':
          // Handle failed charge
          const failedCharge = event.data.object as Stripe.Charge;
          console.log('Charge failed!', failedCharge);
          break;
        case 'customer.subscription.created':
          // Handle subscription creation
          const subscription = event.data.object as Stripe.Subscription;
          console.log('Subscription created!', subscription);
          break;
        case 'customer.subscription.updated':
          // Handle subscription update
          const updatedSubscription = event.data.object as Stripe.Subscription;
          console.log('Subscription updated!', updatedSubscription);
          break;
        case 'customer.subscription.deleted':
          // Handle subscription deletion
          const deletedSubscription = event.data.object as Stripe.Subscription;
          console.log('Subscription deleted!', deletedSubscription);
          break;
        case 'invoice.payment_succeeded':
          // Handle successful invoice payment
          const invoice = event.data.object as Stripe.Invoice;
          console.log('Invoice payment succeeded!', invoice);
          break;
        case 'invoice.payment_failed':
          // Handle failed invoice payment
          const failedInvoice = event.data.object as Stripe.Invoice;
          console.log('Invoice payment failed!', failedInvoice);
          break;
        default:
          // Log unhandled event types
          console.log(`Unhandled event type: ${event.type}`);
          break;
      }
  
      // Return a response to acknowledge receipt of the event
      return res.status(200).send({ received: true });
    }
 
}