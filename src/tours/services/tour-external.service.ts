import { Injectable, Inject } from '@nestjs/common';
import { TourExternalServiceInterface } from './tour-external.service.interface';
import { CoreDAOInterface } from '../dao/tour.core.dao.interface';

import { CORE_SERVICE_TOKEN } from '../token';
import { DataService } from 'src/shared/services/data.service';
import { CoreService } from './tour.service';
import { ResponseObject } from 'src/shared/types';
import { ICoreService } from '../services/tour.service.interface';

@Injectable()
export class TourExternalService implements TourExternalServiceInterface {
  constructor(
    private readonly dataService: DataService,
    @Inject(CORE_SERVICE_TOKEN) private readonly coreService: ICoreService,
  ) {}

  // id of the tour
  /**
   * This service reads the document of the given tourId and returns the value of the field isAVailable
   * @param tourId
   * @returns a boolean to tell if a tour is available or not
   */
  async getTourAvailability(tourId: string): Promise<boolean> {
    const tour = await this.dataService.readDoc('tours', tourId);
    console.log('Tour ID: ', tour.data['isAvailable']);
    return tour.data['isAvailable'];
  }
  // async updateTourAvailability(
  //   id: string,
  //   isAvailable: boolean,
  // ): Promise<ResponseObject> {
  //   return this.coreService.updateTourAvailability(id, isAvailable);
  // }
  // async getAssignedGuide(BookingList: Booking[], id: number): Booking {} // the guide will be derived from the tour
  // getGuideAvailability(): boolean;
  //

  // The tour that has been selected from the booking
  async getTourSelected(selectedTour: string): Promise<ResponseObject> {
    //const tour = await this.dataService.readDoc('tours', selectedTour.id);
    const tour = await this.dataService.readDocsWithConditions('tours', {
      fieldPath: 'name',
      operationString: '==',
      value: selectedTour,
    });

    return tour;
  }

  async updateTourAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<ResponseObject> {
    return await this.coreService.updateTourAvailability(id, isAvailable);
  }
}
