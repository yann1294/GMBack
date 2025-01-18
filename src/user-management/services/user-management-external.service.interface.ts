import { BookingVO } from 'src/booking/vo/booking.master.vo';
import { Guide } from '../dao/guide.entity';

export interface IUserManagementExternalService {
  getGuideAvailability(guide: Guide): Promise<boolean>;
}
