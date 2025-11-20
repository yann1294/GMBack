import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

import { natsConfig } from '../../shared/event-communication/nats.config';
import { NatsService } from 'src/shared/event-communication/nats.service';

/**
 * BookingMessageService
 * - Thin wrapper around NATS messaging for the Booking domain.
 * - Sends booking-related messages to the Payment container.
 */
@Injectable()
export class BookingMessageService {
  // NATS client for publishing / request-response patterns
  private client: ClientProxy;
  // Subject/channel used to communicate with payment container
  private subject: string = 'booking.payment';
  // Sample payload (currently hard-coded, will be replaced by real booking data)
  private data = {
    price: 100,
    tourId: 4562,
    touristId: 9652,
    name: 'Second attempt',
  };

  constructor(private readonly natsService: NatsService) {
    // Initialize NATS client using shared configuration
    this.client = ClientProxyFactory.create(natsConfig);
  }

  /**
   * Fire-and-forget message to payment container.
   * NOTE: Currently ignores the subject/data parameters and uses internal defaults.
   */
  sendDataToPayment(subject: string, data: any) {
    this.natsService.sendDataToContainer(this.client, this.subject, this.data);
  }

  /**
   * Request/response messaging with payment container.
   * NOTE: Currently uses internal subject/data, not the method arguments.
   */
  requestResponseFromPayment(client: ClientProxy, subject: string, data: any) {
    this.natsService.requestResponseFromContainer(
      this.client,
      this.subject,
      this.data,
    );
  }
}
