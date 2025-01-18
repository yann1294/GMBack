import {
  TOUR_EXTERNAL_SERVICE_INTERFACE,
  TOURIST_DAO_TOKEN,
  BOOKING_EXTERNAL_SERVICE_INTERFACE,
} from '../vo/token';

import { BookingVO } from 'src/booking/vo/booking.master.vo';
import { ResponseObject } from 'src/shared/types';
import { TouristVO } from '../vo/user.tourist.vo';
import { ITouristService } from './tourist.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ITouristDAO } from '../dao/tourist.dao.interface';
import { userRoles } from '../utils/roles.util';
import { ITourExternalService } from 'src/tours/services/tour-external.service.interface';

@Injectable()
export class TouristService implements ITouristService {
  constructor(
    @Inject(TOURIST_DAO_TOKEN) private readonly touristDAO: ITouristDAO,
    @Inject(TOUR_EXTERNAL_SERVICE_INTERFACE)
    private readonly tourExternalService: ITourExternalService,
    // @Inject(BOOKING_EXTERNAL_SERVICE_INTERFACE)
    // private readonly bookingExternalService: IBookingExternalService,
  ) {}

  async getAllTourists(): Promise<ResponseObject> {
    return await this.touristDAO.findAll();
  }
  async addTourist(touristVo: TouristVO): Promise<ResponseObject> {
    // assign tourist role
    touristVo.role = userRoles.tourist;
    return await this.touristDAO.create(touristVo.toEntity());
  }
  async deleteTourist(tourist: TouristVO): Promise<ResponseObject> {
    return await this.touristDAO.delete(tourist.toEntity());
  }
  async updateTourist(tourist: TouristVO): Promise<ResponseObject> {
    return await this.touristDAO.update(tourist.toEntity());
  }
  async findTourist(tourist: TouristVO): Promise<ResponseObject> {
    return await this.touristDAO.findById(tourist.toEntity());
  }

  // TODO: Implement using booking container
  async bookTour(booking: BookingVO): Promise<ResponseObject> {
    throw new Error('Method not implemented.');
  }

  getTours(): Promise<ResponseObject> {
    return this.tourExternalService.getTours();
  }
  getPackages(): Promise<ResponseObject> {
    return this.tourExternalService.getPackages();
  }

  // readBookings(): Promise<ResponseObject> {
  //   return this.bookingExternalService.readBookings();
  // }

  // TODO: Implement using booking container
  bookPackage(packageId: string, uid: string): Promise<ResponseObject> {
    throw new Error('Method not implemented.');
  }
}
