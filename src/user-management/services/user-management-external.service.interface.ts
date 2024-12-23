import { BookingVO } from 'src/booking/vo/booking.master.vo';
import { ResponseObject } from 'src/shared/types';

export interface UserManagementExternalServiceInterface {
  getBookingDetails(booking: BookingVO): Promise<void>;
  getBookingStatus(): Promise<void>;
  getGuideAvailability(): Promise<boolean>;
}
