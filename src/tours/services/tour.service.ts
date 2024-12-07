import { ICoreService } from './tour.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Tour } from '../dao/tour.entity';
import { TourVO } from '../vo/tour.master.vo';
import { CoreDAOInterface } from '../dao/tour.core.dao.interface';

import { CORE_DAO_INTERFACE_TOKEN } from '../token';
import { plainToClass } from 'class-transformer';
import { Activity } from '../vo/helper.vo';
import { FieldValue } from 'firebase-admin/firestore';
import { ResponseObject } from 'src/shared/types';

@Injectable()
export class CoreService implements ICoreService {
  constructor(
    @Inject(CORE_DAO_INTERFACE_TOKEN)
    private readonly coreDAO: CoreDAOInterface,
  ) {}

  async createTour(tourVO: TourVO): Promise<ResponseObject> {
    // converting VO to Entity and returning entity
    return await this.coreDAO.create(tourVO.toEntity());
  }

  async updateTour(id: string, tourVo: TourVO): Promise<ResponseObject> {    
    return await this.coreDAO.update(id, tourVo.toEntity());
  }

  async findTourById(id: string): Promise<ResponseObject> {
    return await this.coreDAO.findById(id);
  }
  async findAllTours(): Promise<ResponseObject> {
    return await this.coreDAO.findAll();
  }
  async deleteTour(id: string): Promise<ResponseObject> {
    return await this.coreDAO.delete(id);
  }
  async updateTourAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<ResponseObject> {
    return await this.coreDAO.update(id, plainToClass(Tour, {isAvailable: isAvailable}));
  }

  // TODO: Algorithm for assigning tour
  async assignGuideToTour(tourId: string, guideId: string): Promise<ResponseObject> {
    return await this.coreDAO.update(tourId, plainToClass(Tour, {guide: guideId}));
  }

  // TODO: Algorithm and specifications
  async addActivityToTour(tourVo: TourVO): Promise<ResponseObject> {
    return await this.coreDAO.update(tourVo.id, tourVo.toEntity());
  }

  // TODO: Rethink deletes
  async removeActivityFromTour(tourId: string, activityId: string): Promise<ResponseObject> {
    let tourVo: TourVO = new TourVO();
    tourVo.id = tourId;
    tourVo.activities = {} as Map<number, Activity>;
    tourVo.activities[activityId] = FieldValue.delete();
    return await this.coreDAO.delete(tourId, tourVo.toEntity());
  }

  async listActivitiesForTour(tourId: string): Promise<ResponseObject> {
    // fetch tour with id == tourId
    let tour: ResponseObject = await this.coreDAO.findById(tourId);    
    return {...tour, data: tour.data['activities']} as ResponseObject;
  }

  // TODO: Will operate on a booking session and not the entire tour entity
  getCurrentActivityId(): Promise<string> {
    throw new Error('Method not implemented.');
  }
  setCurrentActivityId(id: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  startCurrentActivity(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  stopCurrentActivity(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
