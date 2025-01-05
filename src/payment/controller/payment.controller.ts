import { Body, Controller, Inject, Post } from "@nestjs/common";
import { PAYMENT_SERVICE_INTERFACE } from "../token";
import { IPaymentService } from "../services/payment.service.interface";
import { PaymentVO } from "../vo/payment.master.vo";
import { PaymentValidationPipe } from "./payment.validation.pipe";


@Controller('payments')
export class PaymentController {
    constructor(@Inject(PAYMENT_SERVICE_INTERFACE) private readonly paymentService: IPaymentService) {  }

    @Post()
    async makePayment(@Body(new PaymentValidationPipe()) payment: PaymentVO): Promise<any> {
        console.log("Payment request", payment)
        return await this.paymentService.processPayment(payment);
    }
}