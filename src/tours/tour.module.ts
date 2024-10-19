import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { FirebaseModule } from 'src/shared/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [TourController],
  providers: [],
})
export class TourModule {}
