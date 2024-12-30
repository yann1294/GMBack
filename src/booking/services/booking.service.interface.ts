import { ResponseObject } from 'src/shared/types';
import { BookingVO } from '../vo/booking.master.vo';

export default interface IBookingService {
  // This will not be required because the tours have guide information in them
  // displayGuide(): Promise<ResponseObject>;
  getAllBookings(): Promise<ResponseObject>;
  getBookingsForResource(resourceId: string): Promise<ResponseObject>;
  cancelBooking(
    bookingId: string,
    touristId: string | string[],
  ): Promise<ResponseObject>;
  makeBooking(booking: BookingVO): Promise<ResponseObject>;
  modifyBooking(bookingId: string, booking: BookingVO): Promise<ResponseObject>;
  displayBooking(bookingId: string): Promise<ResponseObject>;
  displayGuideBookingHistory(guideId: string): Promise<ResponseObject>;
  displayTouristBookingHistory(touristId: string): Promise<ResponseObject>;

  // Comes from the payment container
  // makePayment(): Promise<ResponseObject>;
  // reserveBooking(): Promise<ResponseObject>;
}
