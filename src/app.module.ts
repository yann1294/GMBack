import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TourModule } from './tours/tour.module';
import { BookingModule } from './booking/booking.module';

@Module({
  //  ConfigModule is a replacement of process.env which is slower
  imports: [ConfigModule.forRoot({ cache: true }), TourModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
