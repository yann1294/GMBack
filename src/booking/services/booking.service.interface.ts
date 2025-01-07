import { ResponseObject } from 'src/shared/types';
import { BookingVO } from '../vo/booking.master.vo';
import { GuideVO } from 'src/user-management/vo/user.guide.vo';
import { TouristVO } from 'src/user-management/vo/user.tourist.vo';

export default interface IBookingService {
  // This will not be required because the tours have guide information in them
  // displayGuide(): Promise<ResponseObject>;
  getAllBookings(): Promise<ResponseObject>;
  getBookingsForResource(booking: BookingVO): Promise<ResponseObject>;
  cancelBooking(booking: BookingVO): Promise<ResponseObject>;
  makeBooking(booking: BookingVO): Promise<ResponseObject>;
  modifyBooking(booking: BookingVO): Promise<ResponseObject>;
  displayBooking(booking: BookingVO): Promise<ResponseObject>;
  displayGuideBookingHistory(guideVo: GuideVO): Promise<ResponseObject>;
  displayTouristBookingHistory(touristVo: TouristVO): Promise<ResponseObject>;

  // Comes from the payment container
  // makePayment(): Promise<ResponseObject>;
  // reserveBooking(): Promise<ResponseObject>;
}
