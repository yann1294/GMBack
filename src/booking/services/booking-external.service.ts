import { ResponseObject } from 'src/shared/types';
import { Inject } from '@nestjs/common';

import { IBookingExternalService } from './booking-external.service.interface';
import IBookingService from './booking.service.interface';
import { BOOKING_SERVICE_TOKEN } from '../token';
import { BookingVO } from '../vo/booking.master.vo';

/**
 * BookingExternalService
 * - Facade exposed to other bounded contexts (e.g. Tours, Payment, UI).
 * - Delegates to the internal BookingService while hiding implementation details.
 */
export class BookingExternalService implements IBookingExternalService {
  constructor(
    @Inject(BOOKING_SERVICE_TOKEN)
    private readonly bookingService: IBookingService,
  ) {}
  /**
   * Return full booking details for a given BookingVO.
   */
  getBookingDetails(bookingVo: BookingVO): Promise<ResponseObject> {
    return this.bookingService.displayBooking(bookingVo);
  }
  /**
   * Return just the booking status for a given booking.
   * NOTE: Implementation assumes displayBooking() result is handled synchronously,
   * which will need adjustment (async) in a real implementation.
   */
  getBookingStatus(bookingVo: BookingVO): Promise<string> {
    const booking = this.bookingService.displayBooking(bookingVo);
    return booking['status'];
  }

  /**
   * Return all bookings visible to this service.
   */
  readBookings(): Promise<ResponseObject> {
    return this.bookingService.getAllBookings();
  }
  /**
   * High-level "book package" use case entrypoint (currently a stub).
   */
  bookPackage(packageId: string, uid: string): Promise<ResponseObject> {
    return null;
  }
}
