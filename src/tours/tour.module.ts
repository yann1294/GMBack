import { Module } from '@nestjs/common';
import { TourController } from './controller/tour.controller';
import { DataService } from 'src/shared/services/data.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
import { CoreService } from './services/tour.service';
import { CoreDAO } from './dao/tour.core.dao';
/**
 * Reason for using the format below in the provider.
 *  {
      provide: 'CoreDAOInterface',
      useClass: CoreDAO,
    }

    Interfaces do not exist during runtime so we need a token to represent interfaces. These tokens should be
    registered as providers. However, if we make use of the classes that implement the interfaces, then we
    do not have to use tokens.
 */
@Module({
  imports: [FirebaseModule],
  controllers: [TourController],
  providers: [
    CoreService,
    {
      provide: 'CoreDAOInterface',
      useClass: CoreDAO,
    },
    {
      provide: 'ICoreService',
      useClass: CoreService,
    },
    DataService,
  ],
})
export class TourModule {}
