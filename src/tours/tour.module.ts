import { Module } from '@nestjs/common';
import { TourController } from './controller/tour.controller';
import { DataService } from 'src/shared/services/data.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
//import { FileService } from 'src/shared/services/file.service';
//import { TourValidationPipe } from './controller/validation.pipe';
import { CoreService } from './services/tour.service';
//import { CoreDAOInterface } from './dao/tour.core.dao.interface';
import { CoreDAO } from './dao/tour.core.dao';
import { CORE_DAO_INTERFACE_TOKEN, CORE_SERVICE_TOKEN } from './token';

@Module({
  imports: [FirebaseModule],
  controllers: [TourController],
  providers: [
    {
      provide: CORE_DAO_INTERFACE_TOKEN,
      useClass: CoreDAO,
    },
    DataService,
    {
      provide: CORE_SERVICE_TOKEN,
      useClass: CoreService,
    },
  ],
})
export class TourModule {}
