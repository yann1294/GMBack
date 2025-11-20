import { ResponseObject } from 'src/shared/types';
import { BookingVO } from '../vo/booking.master.vo';
import { GuideVO } from 'src/user-management/vo/guide.vo';
import { TouristVO } from 'src/user-management/vo/tourist.vo';

/**
 * IBookingService
 * - Internal application service contract for booking logic.
 */
export default interface IBookingService {
  // This will not be required because the tours have guide information in them
  // displayGuide(): Promise<ResponseObject>;
  //

  // List all bookings
  getAllBookings(): Promise<ResponseObject>;
  // Fetch bookings for a specific resource (tour/package)
  getBookingsForResource(booking: BookingVO): Promise<ResponseObject>;
  // Delete/cancel a booking
  cancelBooking(booking: BookingVO): Promise<ResponseObject>;
  // Create or update a booking (depending on existing record)
  makeBooking(booking: BookingVO): Promise<ResponseObject>;
  // Modify booking details
  modifyBooking(booking: BookingVO): Promise<ResponseObject>;
  // Read a specific booking
  displayBooking(booking: BookingVO): Promise<ResponseObject>;
  // List bookings associated with a guide
  displayGuideBookingHistory(guideVo: GuideVO): Promise<ResponseObject>;
  // List bookings associated with a tourist
  displayTouristBookingHistory(touristVo: TouristVO): Promise<ResponseObject>;

  // Comes from the payment container
  // makePayment(): Promise<ResponseObject>;
  // reserveBooking(): Promise<ResponseObject>;
}
