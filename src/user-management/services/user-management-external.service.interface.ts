import { BookingVO } from 'src/booking/vo/booking.master.vo';

export interface IUserManagementExternalService {
  getGuideAvailability(tourId: string): Promise<boolean>;
}
