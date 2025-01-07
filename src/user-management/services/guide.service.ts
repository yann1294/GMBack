import {
  GUIDE_DAO_TOKEN,
  BOOKING_EXTERNAL_SERVICE_INTERFACE,
  TOUR_EXTERNAL_SERVICE_INTERFACE,
} from '../vo/token';

import { ITourExternalService } from 'src/tours/services/tour-external.service.interface';

import { Inject, Injectable } from '@nestjs/common';
import { IGuideService } from './guide.service.interface';
import { ResponseObject } from 'src/shared/types';
import { GuideVO } from '../vo/user.guide.vo';
import { IGuideDAO } from '../dao/guide.dao.interface';
import { userRoles } from '../utils/roles.util';
import { BookingVO } from 'src/booking/vo/booking.master.vo';

@Injectable()
export class GuideService implements IGuideService {
  constructor(
    @Inject(GUIDE_DAO_TOKEN) private readonly guideDAO: IGuideDAO,
    @Inject(TOUR_EXTERNAL_SERVICE_INTERFACE)
    private readonly tourExternalService: ITourExternalService,
  ) {}
  async addGuide(guideVo: GuideVO): Promise<ResponseObject> {
    // assign guide role
    guideVo.role = userRoles.guide;
    return await this.guideDAO.create(guideVo.toEntity());
  }
  async deleteGuide(guideVo: GuideVO): Promise<ResponseObject> {
    return await this.guideDAO.delete(guideVo.toEntity());
  }
  async updateGuide(guideVo: GuideVO): Promise<ResponseObject> {
    return await this.guideDAO.update(guideVo.toEntity());
  }
  async findGuide(guideVo: GuideVO): Promise<ResponseObject> {
    return await this.guideDAO.findById(guideVo.toEntity());
  }

  async getAllGuides(): Promise<ResponseObject> {
    return await this.guideDAO.findAll();
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

  // TODO: Implement this with booking and tour containers
  async approveBooking(bookingVo: BookingVO): Promise<ResponseObject> {
    throw new Error('Method not implemented.');
  }
  async declineBooking(bookingVo: BookingVO): Promise<ResponseObject> {
    throw new Error('Method not implemented.');
  }

  async readBookings(): Promise<ResponseObject> {
    throw new Error('Method not implemented.');
  }
}
