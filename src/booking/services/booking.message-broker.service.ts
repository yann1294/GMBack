import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { natsConfig } from '../../shared/event-communication/nats.config';
import { NatsService } from 'src/shared/event-communication/nats.service';

import { RabbitMQService } from 'src/shared/event-communication/rabbitmq.service';

@Injectable()
export class BookingMessageService {
  private client: ClientProxy;
  private subject: string = 'booking.payment';
  private data = {
    price: 100,
    tourId: 4562,
    touristId: 9652,
    name: 'Second attempt',
  };

  //constructor(private readonly natsService: NatsService) {
  constructor(private readonly rabbitMQService: RabbitMQService) {
    //this.client = ClientProxyFactory.create(natsConfig);
  }

  // TODO: the subject should be added to the .env file
  sendDataToPayment(subject: string, data: any) {
    //this.natsService.sendDataToContainer(this.client, this.subject, this.data);
    this.rabbitMQService.sendMessage(
      'this_is_a_test',
      'This message is a test from the sender',
    );
  }

  requestResponseFromPayment(client: ClientProxy, subject: string, data: any) {
    // this.natsService.requestResponseFromContainer(
    //   this.client,
    //   this.subject,
    //   this.data,
    // );

    this.rabbitMQService.getSingleMessage('this_is_a_test');
  }
}
