import { ResponseObject } from 'src/shared/types';
import { BookingVO } from '../vo/booking.master.vo';

/**
 * Public contract for external booking operations.
 * Other modules depend on this interface instead of BookingService directly.
 */
export interface IBookingExternalService {
  // Retrieve full booking details
  getBookingDetails(bookingVo: BookingVO): Promise<ResponseObject>;
  // Retrieve only the booking status
  getBookingStatus(bookingVo: BookingVO): Promise<string>;
  // Retrieve all bookings
  readBookings(): Promise<ResponseObject>;
  // High-level operation to book a package for a user
  bookPackage(packageId: string, uid: string): Promise<ResponseObject>;
}
