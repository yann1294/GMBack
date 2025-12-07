import { Module } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
import { BookingController } from './controller/booking.controller';
import { BookingService } from './services/booking.service';
import { BookingDAO } from './dao/booking.dao';
import {
  BOOKING_SERVICE_TOKEN,
  BOOKING_DAO_INTERFACE_TOKEN,
  BOOKING_EXTERNAL_SERVICE_INTERFACE,
} from './token';
import { TourModule } from 'src/tours/tour.module';
import { UserModule } from 'src/user-management/user.module';
import { BookingExternalService } from './services/booking-external.service';
import { NatsModule } from 'src/shared/event-communication/nats.module';
import { BookingMessageService } from './services/booking.message-broker.service';
import { BookingWorkflow } from './utils/booking.workflow';
import { PaymentWorkflow } from 'src/payment/utils/payment.workflow';
import { InventoryManagement } from './utils/inventory.management';
import { PaymentService } from 'src/payment/services/payment.service';
import {
  PAYMENT_DAO_INTERFACE,
  PAYMENT_SERVICE_INTERFACE,
} from 'src/payment/token';
import { StripeGateway } from 'src/payment/utils/stripe.gateway';
import { PaymentDAO } from 'src/payment/dao/payment.dao';

@Module({
  // External dependencies required by the booking domain
  imports: [FirebaseModule, TourModule, NatsModule],
  // HTTP entrypoints for booking operations
  controllers: [BookingController],
  providers: [
    // Bind BookingDAO to its interface token for DI
    {
      provide: BOOKING_DAO_INTERFACE_TOKEN,
      useClass: BookingDAO,
    },
    // Bind BookingService to its interface token for DI
    {
      provide: BOOKING_SERVICE_TOKEN,
      useClass: BookingService,
    },
    // Exportable facade used by other bounded contexts
    {
      provide: BOOKING_EXTERNAL_SERVICE_INTERFACE,
      useClass: BookingExternalService,
    },
    // Payment service + DAO registered here so booking can orchestrate payments
    {
      provide: PAYMENT_SERVICE_INTERFACE,
      useClass: PaymentService,
    },
    {
      provide: PAYMENT_DAO_INTERFACE,
      useClass: PaymentDAO,
    },
    // Shared infrastructure and workflow components
    DataService, // Firestore abstraction
    BookingMessageService, // NATS message publisher/subscriber for booking events
    BookingWorkflow, // Orchestrates high-level booking flow
    PaymentWorkflow, // Orchestrates high-level payment flow
    InventoryManagement, // Availability & pricing logic
    StripeGateway, // Stripe integration for payments
  ],
  // Make external booking API available to other modules
  exports: [BOOKING_EXTERNAL_SERVICE_INTERFACE],
})
export class BookingModule {}
