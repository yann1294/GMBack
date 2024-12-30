import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TourModule } from './tours/tour.module';
import { BookingModule } from './booking/booking.module';
import { UserModule } from './user-management/user.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  //  ConfigModule is a replacement of process.env which is slower
  imports: [
    ConfigModule.forRoot({ cache: true }),
    TourModule, 
    BookingModule, 
    UserModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
