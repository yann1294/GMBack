import { Module } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
import { BookingController } from './controller/booking.core.controller';
import {
  BOOKING_CORE_DAO_INTERFACE_TOKEN,
  BOOKING_CORE_SERVICE_TOKEN,
} from '../../src/booking/token';
import { CoreDAO } from './dao/booking.core.dao';
import { CoreService } from './services/booking.service';

/**
 * Reason for using the format below in the provider.
 *  {
      provide: CORE_SERVICE_TOKEN,
      useClass: CoreService,
    }

    Interfaces do not exist during runtime so we need a token to represent interfaces. These tokens should be
    registered as providers. However, if we make use of the classes that implement the interfaces, then we
    do not have to use tokens.
 */
@Module({
  imports: [FirebaseModule],
  controllers: [BookingController],
  providers: [
    {
      provide: BOOKING_CORE_DAO_INTERFACE_TOKEN,
      useClass: CoreDAO,
    },
    DataService,
    {
      provide: BOOKING_CORE_SERVICE_TOKEN,
      useClass: CoreService,
    },
  ],
})
export class TourModule {}
