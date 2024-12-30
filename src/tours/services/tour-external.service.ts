import { Injectable, Inject } from '@nestjs/common';
import { ITourExternalService } from './tour-external.service.interface';
import { CoreDAOInterface } from '../dao/tour.core.dao.interface';

import { CORE_SERVICE_TOKEN, PACKAGE_SERVICE_TOKEN } from '../token';
import { DataService } from 'src/shared/services/data.service';
import { CoreService } from './tour.service';
import { ResponseObject } from 'src/shared/types';
import { ICoreService } from '../services/tour.service.interface';
import CreateBookingDTO from 'src/booking/controller/dto/booking.create.dto';
import { IPackageService } from './package.service.interface';

@Injectable()
export class TourExternalService implements ITourExternalService {
  constructor(
    private readonly dataService: DataService,
    @Inject(CORE_SERVICE_TOKEN) private readonly coreService: ICoreService,
    @Inject(PACKAGE_SERVICE_TOKEN)
    private readonly packageService: IPackageService,
    // @Inject(USER_MANAGEMENT_EXTERNAL_SERVICE_INTERFACE)
    // private readonly userService: IPackageService,
  ) {}

  // id of the tour
  async getTourAvailability(tourId: string): Promise<boolean> {
    const tour = await this.dataService.readDoc('tours', tourId);
    console.log('Tour ID: ', tour.data['isAvailable']);
    return tour.data['isAvailable'];
  }

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

  async getAssignedGuide(
    currentBooking: CreateBookingDTO,
  ): Promise<ResponseObject> {
    const tourId = currentBooking.tour;
    const packageId = currentBooking.tourPackage;

    if (tourId != null) {
      return this.coreService.findTourById(tourId);
    } else if (packageId != null) {
      return this.packageService.readTours(packageId);
    }
  }

  async getGuideAvailability(tourId: string): Promise<boolean> {
    return null;
  }
}
