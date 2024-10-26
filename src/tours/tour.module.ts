import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { DataService } from 'src/shared/services/data.service';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';
import { FileService } from 'src/shared/services/file.service';

@Module({
  imports: [FirebaseModule],
  controllers: [TourController],
  providers: [DataService, FileService],
})
export class TourModule {}
