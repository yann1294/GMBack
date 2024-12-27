import { Injectable } from '@nestjs/common';
import { PaymentVO } from '../vo/payment.master.vo';
import { IPaymentService } from './payment.service.interface';
import { StripeGateway } from '../utils/stripe.gateway';
import { PayPalGateway } from '../utils/paypal.gateway';
import { ResponseObject } from 'src/shared/types';

@Injectable()
export class PaymentService implements IPaymentService {
  private gateway: { [key: string]: StripeGateway | PayPalGateway };

  constructor(
    private readonly stripeGateway: StripeGateway,
    private readonly paypalGateway: PayPalGateway,
  ) {
    this.gateway = {
      stripe: this.stripeGateway,
      paypal: this.paypalGateway,
    };
  }

  async processPayment(payment: PaymentVO): Promise<any> {
    const gateway = this.gateway[payment.gateway];
    if (!gateway) {
      return {
        status: 'failure',
        code: 400,
        message: `Unsupported payment gateway: ${payment.gateway}`,
        data: null,
      } as ResponseObject;
    }

    return await gateway.processPayment(payment);
  }

  getTransactionHistory(): Promise<ResponseObject> {
    throw new Error('Method not implemented.');
  }
  confirmPayment(): Promise<ResponseObject> {
    throw new Error('Method not implemented.');
  }
  generatePaymentReceipt(): Promise<ResponseObject> {
    throw new Error('Method not implemented.');
  }
  savePaymentDetails(): Promise<ResponseObject> {
    throw new Error('Method not implemented.');
  }
}
