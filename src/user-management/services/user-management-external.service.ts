import { Inject } from '@nestjs/common';

import { IUserManagementExternalService } from './user-management-external.service.interface';
import { GUIDE_DAO_TOKEN } from '../vo/token';
import { IGuideDAO } from '../dao/guide.dao.interface';
import { Guide } from '../dao/guide.entity';

export class UserManagementExternalService
  implements IUserManagementExternalService
{
  constructor(@Inject(GUIDE_DAO_TOKEN) private readonly guideDAO: IGuideDAO) {}

  // TODO: What is the relationship between Users and Booking ??
  async getGuideAvailability(guide: Guide): Promise<boolean> {
    const chosenGuide = this.guideDAO.findById(guide);
    return chosenGuide['isAvailable'];
  }
}
