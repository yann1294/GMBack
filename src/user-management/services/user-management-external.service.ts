import { BookingVO } from 'src/booking/vo/booking.master.vo';
import { IUserManagementExternalService } from './user-management-external.service.interface';

import { GuideDAO } from '../dao/guide.dao';
import { GUIDE_DAO_TOKEN } from '../vo/token';
import { Inject } from '@nestjs/common';
import { IGuideDAO } from '../dao/guide.dao.interface';

export class UserManagementExternalService
  implements IUserManagementExternalService
{
  //constructor(@Inject(GUIDE_DAO_TOKEN) private readonly guideDAO: IGuideDAO) {}

  // TODO: What is the relationship between Users and Booking ??

  async getBookingDetails(booking: BookingVO): Promise<void> {
    console.log('This is supposed to get the user details');
  }
  async getBookingStatus(guideId: string): Promise<void> {}
  async getGuideAvailability(guideId: string): Promise<boolean> {
    //const guide = this.guideDAO.findById(guideId);
    //return guide['isAvailable'];
    return;
  }
}
