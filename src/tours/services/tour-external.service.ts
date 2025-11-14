import { Injectable, Inject } from '@nestjs/common';
import { ITourExternalService } from './tour-external.service.interface';
import { CoreDAOInterface } from '../dao/tour.core.dao.interface';

import { CORE_SERVICE_TOKEN, PACKAGE_SERVICE_TOKEN } from '../token';
import { DataService } from 'src/shared/services/data.service';
import { ResponseObject } from 'src/shared/types';
import { ICoreService } from './tour.core.service.interface';
import CreateBookingDTO from 'src/booking/controller/dto/booking.create.dto';
import { IPackageService } from './package.service.interface';
import { TourVO } from '../vo/tour.master.vo';

@Injectable()
export class TourExternalService implements ITourExternalService {
  // Bridges Tours with other bounded contexts (Booking, Payments, etc.)
  constructor(
    private readonly dataService: DataService,
    @Inject(CORE_SERVICE_TOKEN) private readonly coreService: ICoreService,
    @Inject(PACKAGE_SERVICE_TOKEN)
    private readonly packageService: IPackageService,
    // @Inject(USER_MANAGEMENT_EXTERNAL_SERVICE_INTERFACE)
    // private readonly userService: IPackageService,
  ) {}

  // id of the tour
  /**
   * Check if a tour is available based on its id.
   * Reads 'isAvailable' from the 'tours' document.
   */
  async getTourAvailability(tourId: string): Promise<boolean> {
    const tour = await this.dataService.readDoc('tours', tourId);
    console.log('Tour ID: ', tour.data['isAvailable']);
    return tour.data['isAvailable'];
  }

  // The tour that has been selected from the booking
  /**
   * Retrieve a tour by its name.
   * This reads from 'tours' collection using a where condition on 'name'.
   */
  async getTourSelected(selectedTour: string): Promise<ResponseObject> {
    //const tour = await this.dataService.readDoc('tours', selectedTour.id);
    const tour = await this.dataService.readDocsWithConditions('tours', {
      fieldPath: 'name',
      operationString: '==',
      value: selectedTour,
    });

    return tour;
  }

  /**
   * Update availability and other fields for a given tour using the core service.
   */
  async updateTourAvailability(tourVO: TourVO): Promise<ResponseObject> {
    return await this.coreService.updateTourAvailability(tourVO);
  }

  /**
   * Resolve which guide is assigned to a booking, based on either tour or package.
   * Implementation is currently incomplete.
   */
  async getAssignedGuide(
    currentBooking: CreateBookingDTO,
  ): Promise<ResponseObject> {
    const tourId = currentBooking.tour;
    const packageId = currentBooking.tourPackage;

    if (tourId != null) {
      //return this.coreService.findTourById(currentBooking.tour);
      // Future: delegate to coreService to fetch tour and its guide.
      throw new Error('Method not implemented.');
    } else if (packageId != null) {
      //return this.packageService.readTours(packageId);
      //throw new Error('Method not implemented.');
      // Future: use packageService.readTours(packageId) then derive guide.
      return null;
    }
  }

  /**
   * Placeholder for guide availability lookup.
   */
  async getGuideAvailability(tourId: string): Promise<boolean> {
    return null;
  }

  /**
   * Expose all tours to external modules (e.g. Booking) via the core service.
   */
  getTours(): Promise<ResponseObject> {
    return this.coreService.findAllTours();
  }
  /**
   * Expose all packages to external modules.
   */
  getPackages(): Promise<ResponseObject> {
    return this.packageService.findAllPackages();
  }
  /**
   * Placeholder for reading bookings in the Tours context.
   */
  readBookings(): Promise<ResponseObject> {
    return null;
  }
}
