import { ResponseObject } from 'src/shared/types';
import { Inject } from '@nestjs/common';

import { IBookingExternalService } from './booking-external.service.interface';
import IBookingService from './booking.service.interface';
import { BOOKING_SERVICE_TOKEN } from '../token';

export class BookingExternalService implements IBookingExternalService {
  constructor(
    @Inject(BOOKING_SERVICE_TOKEN)
    private readonly bookingService: IBookingService,
  ) {}
  getBookingDetails(bookingId: string): Promise<ResponseObject> {
    return this.bookingService.displayBooking(bookingId);
  }
  getBookingStatus(bookingId: string): Promise<string> {
    const booking = this.bookingService.displayBooking(bookingId);
    return booking['status'];
  }

  readBookings(): Promise<ResponseObject> {
    return this.bookingService.getAllBookings();
  }

  bookPackage(packageId: string, uid: string): Promise<ResponseObject> {
    return null;
  }
}
