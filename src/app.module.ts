import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TourModule } from './tours/tour.module';
import { BookingModule } from './booking/booking.module';
import { UserModule } from './user-management/user.module';
import { PaymentModule } from './payment/payment.module';
import { AuthModule } from './authentication/auth.module';

// Root module of the NestJS application
// It composes all feature modules and global infrastructure modules.
@Module({
  // imports: list of modules that this root module depends on
  imports: [
    // ConfigModule: centralised configuration layer for environment variables
    // - cache: true keeps config values in memory for faster repeated access
    ConfigModule.forRoot({ cache: true }),
    // Domain / feature modules
    TourModule, // Tour search, packages, itineraries, etc.
    BookingModule, // Booking flows, inventory, pricing
    UserModule, // User management: admin, guide, tourist, etc.
    PaymentModule, // Payment processing and payment providers
    AuthModule, // Authentication & authorization (JWT, OAuth, etc.)
  ],
  // controllers: controllers owned by this module
  controllers: [AppController],
  // providers: injectable services that this module provides and shares
  providers: [AppService],
})
export class AppModule {}
