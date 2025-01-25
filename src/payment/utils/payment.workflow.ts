import { Inject, Injectable } from "@nestjs/common";
import { IPaymentService } from "../services/payment.service.interface";
import { PaymentVO } from "../vo/payment.master.vo";
import { PAYMENT_SERVICE_INTERFACE } from "../token";

@Injectable()
export class PaymentWorkflow {
  constructor(
    @Inject(PAYMENT_SERVICE_INTERFACE) private readonly payment: IPaymentService,
  ) {}

  async executePayment(payment: PaymentVO) {
    // Step 1: Process payment
    let paymentResponse = await this.payment.processPayment(payment);

    // Step 2: Record transaction
    let transaction = await this.payment.savePaymentDetails(payment);

    // Step 3: Return payment details
    return {
      transaction
    };
  }
}