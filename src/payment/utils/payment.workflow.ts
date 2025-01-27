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
    // Step 1: Generates a stripe session containing payment details
    let paymentResponse = await this.payment.processPayment(payment);

    // check whether there was an error
    if (paymentResponse.status !== undefined && paymentResponse.status !== "success") return paymentResponse;

    // Step 2: Record transaction
    let response = await this.payment.savePaymentDetails(paymentResponse['payment']);

    // check whether there was an error
    if (response.status !== "success") return response;

    // Step 3: Return payment details
    return {
      status: "success",
      code: 200,
      message: "Payment successfully created.",
      data: paymentResponse['session'],
    };
  }
}