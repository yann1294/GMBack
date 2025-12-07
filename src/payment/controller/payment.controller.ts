import {
  Body,
  Controller,
  Inject,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { PAYMENT_SERVICE_INTERFACE } from '../token';
import { IPaymentService } from '../services/payment.service.interface';
import { PaymentVO } from '../vo/payment.master.vo';
import { PaymentValidationPipe } from './payment.validation.pipe';
import Stripe from 'stripe';
import * as express from 'express';
import { PaymentWorkflow } from '../utils/payment.workflow';
import { plainToInstance } from 'class-transformer';

@Controller('payments')
export class PaymentController {
  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia', // <-- updated to match recognized version
  });
  constructor(
    @Inject(PAYMENT_SERVICE_INTERFACE)
    private readonly paymentService: IPaymentService,
    private readonly paymentWorkflow: PaymentWorkflow,
  ) {}

  // @Post()
  // async makePayment(@Body(new PaymentValidationPipe()) payment: PaymentVO): Promise<any> {
  //     console.log("Payment request", payment)
  //     return await this.paymentService.processPayment(payment);
  // }

  @Post()
  async makePayment(
    @Body(new PaymentValidationPipe()) payment: PaymentVO,
  ): Promise<any> {
    // Cicéron: Payment service receives data from booking container (booking workflow)
    return await this.paymentWorkflow.executePayment(payment);
  }

  @Post('webhooks/stripe')
  async stripeWebhook(
    @Req() req: RawBodyRequest<express.Request>,
    @Res() res: express.Response,
  ) {
    // Retrieve the Stripe signature from the headers
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      // Construct the Stripe event using the raw body and signature
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      // Log the error if webhook verification fails
      console.error('Error verifying Stripe webhook signature:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (
      ['checkout.session.completed', 'checkout.session.expired'].includes(
        event.type,
      )
    ) {
      // Handle the event based on its type
      let data: any = req.body;
      console.log('Event:', data.data.object.id);

      // fetch payment by session id
      let payment = (
        await this.paymentService.findByCondition({
          fieldPath: 'sessionId',
          value: data.data.object.id,
          operationString: '==',
        })
      ).data[0] as PaymentVO;
      console.log(payment);

      switch (event.type) {
        case 'checkout.session.completed':
          // update payment status to completed
          // 'pending', 'completed', 'canceled', 'refunded', 'refund-in-progress', 'in-progress'
          return await this.paymentService.updatePayment(
            plainToInstance(PaymentVO, { id: payment.id, status: 'completed' }),
          );
        case 'checkout.session.expired':
          return await this.paymentService.updatePayment(
            plainToInstance(PaymentVO, { id: payment.id, status: 'failed' }),
          );
      }
    }

    // Return a response to acknowledge receipt of the event
    return res.status(200).send({ received: true });
  }
}
