import { Module } from '@nestjs/common';
import { TourController } from './controller/tour.controller';
import { DataService } from 'src/shared/services/data.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
import { FileService } from 'src/shared/services/file.service';
import { TourValidationPipe } from './controller/validation.pipe';

@Module({
  imports: [FirebaseModule],
  controllers: [TourController],
  providers: [DataService, FileService, TourValidationPipe],
})
export class TourModule {}
