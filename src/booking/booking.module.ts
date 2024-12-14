import { Module } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
import { BookingController } from './controller/booking.controller';
import { BookingService } from './services/booking.service';
import { BookingDAO } from './dao/booking.dao';
import { BOOKING_SERVICE_TOKEN, BOOKING_DAO_INTERFACE_TOKEN } from './token';

@Module({
  imports: [FirebaseModule],
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
    DataService,
  ],
})
export class BookingModule {}
