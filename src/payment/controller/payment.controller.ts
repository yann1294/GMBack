import { Body, Controller, Inject, Post, Req, Res } from "@nestjs/common";
import { PAYMENT_SERVICE_INTERFACE } from "../token";
import { IPaymentService } from "../services/payment.service.interface";
import { PaymentVO } from "../vo/payment.master.vo";
import { PaymentValidationPipe } from "./payment.validation.pipe";
import Stripe from "stripe";
import { FastifyRequest } from "fastify";


@Controller('payments')
export class PaymentController {
    private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-12-18.acacia',
      });
    constructor(@Inject(PAYMENT_SERVICE_INTERFACE) private readonly paymentService: IPaymentService) {  }

    @Post()
    async makePayment(@Body(new PaymentValidationPipe()) payment: PaymentVO): Promise<any> {
        console.log("Payment request", payment)
        return await this.paymentService.processPayment(payment);
    }

    @Post('stripe')
  async handleStripeWebhook(@Req() req: FastifyRequest, @Res() res: Response) {
    
  }
}