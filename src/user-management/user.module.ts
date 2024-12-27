import { Module } from '@nestjs/common';

import { FirebaseModule } from 'src/shared/firebase/firebase.module';
import { UserManagementExternalService } from './services/user-management-external.service';

import { USER_MANAGEMENT_EXTERNAL_SERVICE_INTERFACE } from './token';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [FirebaseModule],
  controllers: [],
  providers: [
    {
      provide: USER_MANAGEMENT_EXTERNAL_SERVICE_INTERFACE,
      useClass: UserManagementExternalService,
    },
  ],
  exports: [USER_MANAGEMENT_EXTERNAL_SERVICE_INTERFACE],
})
export class UserModule {}
