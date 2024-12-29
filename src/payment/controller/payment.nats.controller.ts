import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class PaymentFromNats {
  // TODO: define a NATS Transport in main and define event queue group
  @EventPattern('booking.payment')
  handleMessageFromBooking(@Payload() data: any) {
    console.log('booking.payment');
    console.log('Received message : ', data);
  }
}
