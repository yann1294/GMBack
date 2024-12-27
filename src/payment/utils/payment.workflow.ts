import { IPaymentWorkflow } from '../services/payment.workflow.interface';
import { PayPalGateway } from '../service/paypal.gateway';
import { StripeGateway } from './stripe.gateway';
import { PaymentGateway } from '../service/payment.gateway.interface';

export class PaymentWorkflow implements IPaymentWorkflow {
  private gateways: { [key: string]: PaymentGateway } = {
    paypal: new PayPalGateway(),
    stripe: new StripeGateway(),
  };

  async routePaymentRequest(gatewayType: string, amount: number, currency: string, paymentMethod: any): Promise<string> {
    const gateway = this.gateways[gatewayType];
    if (!gateway) {
      throw new Error(`Unsupported payment gateway: ${gatewayType}`);
    }
    return gateway.processPayment(amount, currency, paymentMethod);
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

  async getBookingFees(): Promise<void> {
    // Logic to get booking fees
  }

  async savePaymentDetails(): Promise<void> {
    // Logic to save payment details
  }

  async refundPayment(): Promise<void> {
    // Logic to refund a payment
  }
}
