import { Module } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
import { PAYMENT_SERVICE_INTERFACE, PAYMENT_DAO_INTERFACE } from './token';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controller/payment.controller';
import { PaymentDAO } from './dao/payment.dao';
import { StripeGateway } from './utils/stripe.gateway';
import { PayPalGateway } from './utils/paypal.gateway';
import { PaymentFromNats } from './controller/payment.nats.controller';
@Module({
  imports: [FirebaseModule],
  controllers: [PaymentController, PaymentFromNats],
  providers: [
    StripeGateway,
    PayPalGateway,
    {
      provide: PAYMENT_SERVICE_INTERFACE,
      useClass: PaymentService,
    },
    {
      provide: PAYMENT_DAO_INTERFACE,
      useClass: PaymentDAO,
    },
  ],
})
export class PaymentModule {}
