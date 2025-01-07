import { ResponseObject } from 'src/shared/types';
import { Inject } from '@nestjs/common';

import { IBookingExternalService } from './booking-external.service.interface';
import IBookingService from './booking.service.interface';
import { BOOKING_SERVICE_TOKEN } from '../token';
import { BookingVO } from '../vo/booking.master.vo';

export class BookingExternalService implements IBookingExternalService {
  constructor(
    @Inject(BOOKING_SERVICE_TOKEN)
    private readonly bookingService: IBookingService,
  ) {}
  getBookingDetails(bookingVo: BookingVO): Promise<ResponseObject> {
    return this.bookingService.displayBooking(bookingVo);
  }
  getBookingStatus(bookingVo: BookingVO): Promise<string> {
    const booking = this.bookingService.displayBooking(bookingVo);
    return booking['status'];
  }

  readBookings(): Promise<ResponseObject> {
    return this.bookingService.getAllBookings();
  }

  bookPackage(packageId: string, uid: string): Promise<ResponseObject> {
    return null;
  }
}
