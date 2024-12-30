import { BookingVO } from 'src/booking/vo/booking.master.vo';

export interface IUserManagementExternalService {
  getBookingDetails(booking: BookingVO): Promise<void>;
  getBookingStatus(guideId: string): Promise<void>;
  getGuideAvailability(tourId: string): Promise<boolean>;
}
