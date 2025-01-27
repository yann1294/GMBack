import { Inject, Injectable } from '@nestjs/common';
import { PaymentVO } from '../vo/payment.master.vo';
import { IPaymentService } from './payment.service.interface';
import { StripeGateway } from '../utils/stripe.gateway';
import { PayPalGateway } from '../utils/paypal.gateway';
import { ResponseObject } from 'src/shared/types';
import { PAYMENT_DAO_INTERFACE } from '../token';
import { IPaymentDAO } from '../dao/payment.dao.interface';

@Injectable()
export class PaymentService implements IPaymentService {
  private gateway: { [key: string]: StripeGateway };

  constructor(
    @Inject(PAYMENT_DAO_INTERFACE) private readonly paymentDAO: IPaymentDAO,
    private readonly stripeGateway: StripeGateway,
  ) {
    this.gateway = {
      stripe: this.stripeGateway,
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

  async savePaymentDetails(payment: PaymentVO): Promise<ResponseObject> {
    return await this.paymentDAO.create(payment.toEntity());
  }

  async findByBooking(bookingId: string): Promise<ResponseObject> {
      return await this.paymentDAO.findByCondition({
        fieldPath: 'bookingId',
        value: bookingId,
        operationString: "=="
      });
    }
    async findByPayment(paymentId: string): Promise<ResponseObject> {
      return await this.paymentDAO.findByCondition({
        fieldPath: 'paymentId',
        value: paymentId,
        operationString: "=="
      });
    }
    async findByResource(resourceId: string): Promise<ResponseObject> {
      return await this.paymentDAO.findByCondition({
        fieldPath: 'resourceId',
        value: resourceId,
        operationString: "=="
      });
    }
    async findByUser(userId: string): Promise<ResponseObject> {
      return await this.paymentDAO.findByCondition({
        fieldPath: 'userId',
        value: userId,
        operationString: "=="
      });
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
}
