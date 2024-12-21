import { Injectable, Inject } from '@nestjs/common';
import { TourExternalServiceInterface } from './tour-external.service.interface';
import { CoreDAOInterface } from '../dao/tour.core.dao.interface';

import { CORE_DAO_INTERFACE_TOKEN } from '../token';
import { DataService } from 'src/shared/services/data.service';
import { CoreService } from './tour.service';
import { ResponseObject } from 'src/shared/types';

@Injectable()
export class TourExternalService implements TourExternalServiceInterface {
  constructor(private readonly dataService: DataService) {}

  // id of the tour
  async getTourAvailability(id: string): Promise<boolean> {
    const tour = await this.dataService.readDoc('tours', id);
    console.log('Is tour available ', tour);
    //return tour.data?.isAvailable;
    return false;
  }
  // async updateTourAvailability(
  //   id: string,
  //   isAvailable: boolean,
  // ): Promise<ResponseObject> {
  //   return this.coreService.updateTourAvailability(id, isAvailable);
  // }
  // async getAssignedGuide(BookingList: Booking[], id: number): Booking {} // the guide will be derived from the tour
  // getGuideAvailability(): boolean;
  // getTourSelected(tour: Tour): Tour;
}
