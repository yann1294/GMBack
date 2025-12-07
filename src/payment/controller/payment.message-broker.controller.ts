import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentInfoVo } from 'src/booking/vo/payment-info.vo';

@Controller()
export class PaymentFromNats {
  private paymentData: PaymentInfoVo;
  // TODO: define a NATS Transport in main and define event queue group
  @EventPattern('booking.payment')
  //@MessagePattern('booking.payment')
  handleMessageFromBooking(@Payload() data: any) {
    console.log('Received message : ', data);
    this.paymentData = data as PaymentInfoVo;
  }

  get dataFromBooking(): PaymentInfoVo{
    return this.paymentData;
  }
}
