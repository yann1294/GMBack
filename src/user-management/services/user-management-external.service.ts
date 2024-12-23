import { BookingVO } from 'src/booking/vo/booking.master.vo';
import { UserManagementExternalServiceInterface } from './user-management-external.service.interface';

export class UserManagementExternalService
  implements UserManagementExternalServiceInterface
{
  async getBookingDetails(booking: BookingVO): Promise<void> {
    console.log('This is supposed to get the user details');
  }
  async getBookingStatus(): Promise<void> {}
  async getGuideAvailability(): Promise<boolean> {
    return true;
  }
}
