import { Inject } from '@nestjs/common';

import { IUserManagementExternalService } from './user-management-external.service.interface';
import { GUIDE_DAO_TOKEN } from '../vo/token';
import { IGuideDAO } from '../dao/guide.dao.interface';

export class UserManagementExternalService
  implements IUserManagementExternalService
{
  constructor(@Inject(GUIDE_DAO_TOKEN) private readonly guideDAO: IGuideDAO) {}

  // TODO: What is the relationship between Users and Booking ??
  async getGuideAvailability(guideId: string): Promise<boolean> {
    const guide = this.guideDAO.findById(guideId);
    return guide['isAvailable'];
  }
}
