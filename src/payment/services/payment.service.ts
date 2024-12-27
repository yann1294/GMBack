import { Injectable } from '@nestjs/common';
import { PaymentVO } from '../vo/payment.master.vo';
import { IPaymentService } from './payment.service.interface';


@Injectable()
export class PaymentService implements IPaymentService {
  
  async processPayment(payment: PaymentVO): Promise<any> {
    // route payment to the appropriate gateway
  }

  async getTransactionHistory(): Promise<void> {
    // Logic to get payment history
  }

  async confirmPayment(): Promise<void> {
    // Logic to confirm a payment
    // Talks with payment validator
  }

  async generatePaymentReceipt(): Promise<void> {
    // Logic to generate a payment receipt
  }

  // async getBookingFees(): Promise<void> {
  //   // Logic to get booking fees
  // }

  async savePaymentDetails(): Promise<void> {
    // Logic to save payment details
  }

  async refundPayment(): Promise<void> {
    // Logic to refund a payment
  }
}
