import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { BOOKING_CORE_SERVICE_TOKEN } from '../token';

@Controller('bookings')
export class BookingController {
  collectionName: string = 'bookings';

  // inject firebase repository
  constructor(
    @Inject(BOOKING_CORE_SERVICE_TOKEN)
    private readonly bookingService: IBookingService,
  ) {}

  async displayGuide() {}
  async cancelBooking() {}
  async makeBooking() {}
  async modifyBooking() {}
  async displayBooking() {}
  async displayBookingHistory() {}
  async makePayment() {}
  async reserveBooking() {}
}
