import { Module } from '@nestjs/common';
import { DataService } from 'src/shared/services/data.service';
import { FileService } from 'src/shared/services/file.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';

import { CoreService } from './services/tour.service';
import { CoreDAO } from './dao/tour.core.dao';
import { TourController } from './controller/core.controller';
import { PackageController } from './controller/package.controller';
import { PackageDAO } from './dao/package.dao';
import { PackageService } from './services/package.service';
import { TourExternalService } from './services/tour-external.service';

import {
  CORE_DAO_INTERFACE_TOKEN,
  CORE_SERVICE_TOKEN,
  PACKAGE_DAO_INTERFACE_TOKEN,
  PACKAGE_SERVICE_TOKEN,
  // TOUR_EXTERNAL_SERVICE_INTERFACE,
} from './token';
import { TourValidationPipe } from './controller/core.validation.pipe';

@Module({
  imports: [FirebaseModule],
  controllers: [TourController, PackageController],
  providers: [
    {
      provide: CORE_DAO_INTERFACE_TOKEN,
      useClass: CoreDAO,
    },
    {
      provide: CORE_SERVICE_TOKEN,
      useClass: CoreService,
    },
    {
      provide: PACKAGE_DAO_INTERFACE_TOKEN,
      useClass: PackageDAO,
    },
    {
      provide: PACKAGE_SERVICE_TOKEN,
      useClass: PackageService,
    },
    {
      provide: 'TOUR_PIPE_ORIGIN',
      useValue: 'default', // or some dynamic config
    },
    {
      provide: TourValidationPipe,
      useFactory: (origin: string) => new TourValidationPipe(origin),
      inject: ['TOUR_PIPE_ORIGIN'],
    },
    DataService,
    FileService, // <-- Provide FileService here
    TourExternalService,
    // {
    //   provide: TOUR_EXTERNAL_SERVICE_INTERFACE,
    //   useClass: TourExternalService,
    // },
  ],
  exports: [TourExternalService],
})
export class TourModule {}
