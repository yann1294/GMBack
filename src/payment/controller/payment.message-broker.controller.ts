import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class PaymentFromNats {
  count = 0;
  // TODO: define a NATS Transport in main and define event queue group
  @EventPattern('booking.payment')
  //@MessagePattern('booking.payment')
  handleMessageFromBooking(@Payload() data: any) {
    console.log('Received message : ', data);
  }
}
