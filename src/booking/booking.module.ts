import { Module } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
import {
  BOOKING_DAO_INTERFACE_TOKEN,
  BOOKING_SERVICE_TOKEN,
} from '../../src/booking/token';
import { BookingController } from './controller/booking.controller';
import { BookingService } from './services/booking.service';
import { BookingDAO } from './dao/booking.dao';

@Module({
  imports: [FirebaseModule],
  controllers: [BookingController],
  providers: [
    {
      provide: BOOKING_SERVICE_TOKEN,
      useClass: BookingService,
    },
    {
      provide: BOOKING_DAO_INTERFACE_TOKEN,
      useClass: BookingDAO,
    },
    DataService,
  ],
})
export class BookingModule {}
