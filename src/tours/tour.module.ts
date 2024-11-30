import { Module } from '@nestjs/common';
import { TourController } from './controller/tour.controller';
import { DataService } from 'src/shared/services/data.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
import { FileService } from 'src/shared/services/file.service';
import { TourValidationPipe } from './controller/validation.pipe';
import { CoreService } from './services/tour.service';
import { CoreDAOInterface } from './dao/tour.core.dao.interface';
import { CoreDAO } from './dao/tour.core.dao';

@Module({
  imports: [FirebaseModule],
  controllers: [TourController],
  providers: [CoreDAO, DataService, CoreService],
})
export class TourModule {}
