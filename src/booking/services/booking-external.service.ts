import { ResponseObject } from 'src/shared/types';
import { BookingExternalServiceInterface } from './booking-external.service.interface';
import IBookingService from './booking.service.interface';

import { BOOKING_SERVICE_TOKEN } from '../token';
import { Inject } from '@nestjs/common';

export class BookingExternalService {
  // constructor(
  //   @Inject(BOOKING_SERVICE_TOKEN)
  //   private readonly bookingService: IBookingService,
  // ) {}
  // getBookingDetails(bookingId: string): Promise<ResponseObject> {
  //   return this.bookingService.displayBooking(bookingId);
  // }
  // getBookingStatus(bookingId: string): Promise<string> {
  //   const booking = this.bookingService.displayBooking(bookingId);
  //   return booking['status'];
  // }
}
