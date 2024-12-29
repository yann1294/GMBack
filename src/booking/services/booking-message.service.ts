import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { natsConfig } from '../../shared/event-communication/nats.config';
import { NatsService } from 'src/shared/event-communication/nats.service';

@Injectable()
export class BookingMessageService {
  private client: ClientProxy;
  private subject: string = 'booking.payment';
  private data = {
    price: 100,
    tourId: 4562,
    touristId: 9652,
  };

  constructor(private readonly natsService: NatsService) {
    console.log(natsConfig);
    this.client = ClientProxyFactory.create(natsConfig);
  }

  // TODO: the subject should be added to the .env file
  sendDataToPayment(subject: string, data: any) {
    console.log('booking.payment');
    this.natsService.sendDataToContainer(this.client, this.subject, this.data);
  }

  requestResponseFromPayment(client: ClientProxy, subject: string, data: any) {
    console.log('booking.payment');
    this.natsService.requestResponseFromContainer(
      this.client,
      this.subject,
      this.data,
    );
  }
}
