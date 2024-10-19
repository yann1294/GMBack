import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TourModule } from './tours/tour.module';

@Module({
  //  ConfigModule is a replacement of process.env which is slower
  imports: [ConfigModule.forRoot({ cache: true }), TourModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
