import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
import { GuideController } from './controller/guide.controller';
import { TouristController } from './controller/tourist.controller';
import {
  GUIDE_DAO_TOKEN,
  GUIDE_SERVICE_TOKEN,
  TOURIST_DAO_TOKEN,
  TOURIST_SERVICE_TOKEN,
  USER_MANAGEMENT_EXTERNAL_SERVICE_INTERFACE,
} from './vo/token';
import { GuideDAO } from './dao/guide.dao';
import { DataService } from 'src/shared/services/data.service';
import { TouristDAO } from './dao/tourist.dao';
import { GuideService } from './services/guide.service';
import { TouristService } from './services/tourist.service';
import { FileService } from 'src/shared/services/file.service';
import { UserManagementExternalService } from './services/user-management-external.service';

@Module({
  imports: [FirebaseModule],
  controllers: [GuideController, TouristController],
  providers: [
    DataService,
    FileService,
    {
      provide: GUIDE_DAO_TOKEN,
      useClass: GuideDAO,
    },
    {
      provide: TOURIST_DAO_TOKEN,
      useClass: TouristDAO,
    },
    {
      provide: GUIDE_SERVICE_TOKEN,
      useClass: GuideService,
    },
    {
      provide: TOURIST_SERVICE_TOKEN,
      useClass: TouristService,
    },
    {
      provide: USER_MANAGEMENT_EXTERNAL_SERVICE_INTERFACE,
      useClass: UserManagementExternalService,
    },
  ],
  exports: [USER_MANAGEMENT_EXTERNAL_SERVICE_INTERFACE],
})
export class UserModule {}
