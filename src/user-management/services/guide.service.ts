import { Inject, Injectable } from '@nestjs/common';
import { IGuideService } from './guide.service.interface';
import {
  GUIDE_DAO_TOKEN,
  BOOKING_EXTERNAL_SERVICE_INTERFACE,
  TOUR_EXTERNAL_SERVICE_INTERFACE,
} from '../vo/token';
import { ResponseObject } from 'src/shared/types';
import { GuideVO } from '../vo/user.guide.vo';
import { IGuideDAO } from '../dao/guide.dao.interface';
import { IBookingExternalService } from 'src/booking/services/booking-external.service.interface';
import { ITourExternalService } from 'src/tours/services/tour-external.service.interface';

@Injectable()
export class GuideService implements IGuideService {
  constructor(
    @Inject(GUIDE_DAO_TOKEN) private readonly guideDAO: IGuideDAO,
    // @Inject(BOOKING_EXTERNAL_SERVICE_INTERFACE)
    // private readonly bookingExternalService: IBookingExternalService,
    @Inject(TOUR_EXTERNAL_SERVICE_INTERFACE)
    private readonly tourExternalService: ITourExternalService,
  ) {}
  async addGuide(guideVo: GuideVO): Promise<ResponseObject> {
    return await this.guideDAO.create(guideVo.toEntity());
  }
  async deleteGuide(uid: string): Promise<ResponseObject> {
    return await this.guideDAO.delete(uid);
  }
  async updateGuide(uid: string, data: GuideVO): Promise<ResponseObject> {
    return await this.guideDAO.update(uid, data.toEntity());
  }
  async findGuide(uid: string): Promise<ResponseObject> {
    return await this.guideDAO.findById(uid);
  }

  async getAllGuides(): Promise<ResponseObject> {
    return await this.guideDAO.findAll();
  }

  // TODO: Implement this with booking and tour containers
  async approveBooking(bookingId: string): Promise<ResponseObject> {
    throw new Error('Method not implemented.');
  }
  async declineBooking(bookingId: string): Promise<ResponseObject> {
    throw new Error('Method not implemented.');
  }
  async getTours(): Promise<ResponseObject> {
    return this.tourExternalService.getTours();
  }
  async getPackages(): Promise<ResponseObject> {
    return this.tourExternalService.getPackages();
  }
  // async readBookings(): Promise<ResponseObject> {
  //   return this.bookingExternalService.readBookings();
  // }
}
