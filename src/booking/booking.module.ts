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

@Module({
  imports: [FirebaseModule, TourModule, UserModule],
  controllers: [BookingController],
  providers: [
    {
      provide: BOOKING_DAO_INTERFACE_TOKEN,
      useClass: BookingDAO,
    },
    {
      provide: BOOKING_SERVICE_TOKEN,
      useClass: BookingService,
    },
    {
      provide: BOOKING_EXTERNAL_SERVICE_INTERFACE,
      useClass: BookingExternalService,
    },
    DataService,
  ],
  exports: [BOOKING_EXTERNAL_SERVICE_INTERFACE],
})
export class BookingModule {}
