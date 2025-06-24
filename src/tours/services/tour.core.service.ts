import { ICoreService } from './tour.core.service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Tour } from '../dao/tour.entity';
import { TourVO } from '../vo/tour.master.vo';
import { CoreDAOInterface } from '../dao/tour.core.dao.interface';
import { CORE_DAO_INTERFACE_TOKEN } from '../token';
import { plainToClass } from 'class-transformer';
import { Activity } from '../vo/helper.vo';
import { FieldValue } from 'firebase-admin/firestore';
import { ResponseObject } from 'src/shared/types';
import { MultipartFile } from '@fastify/multipart';

@Injectable()
export class CoreService implements ICoreService {
  constructor(
    @Inject(CORE_DAO_INTERFACE_TOKEN)
    private readonly coreDAO: CoreDAOInterface,
  ) {}

  async createTour(tourVo: TourVO): Promise<ResponseObject> {
    // converting VO to Entity and returning entity
    return await this.coreDAO.create(tourVo.toEntity());
  }

  async updateTour(tourVo: Tour): Promise<ResponseObject> {
    return await this.coreDAO.update(tourVo);
  }

  async findTourById(tourVo: TourVO): Promise<ResponseObject> {
    return await this.coreDAO.findById(tourVo.toEntity());
  }
  async findAllTours(): Promise<ResponseObject> {
    return await this.coreDAO.findAll();
  }
  async deleteTour(tourVo: TourVO): Promise<ResponseObject> {
    return await this.coreDAO.delete(tourVo.toEntity());
  }
  async updateTourAvailability(tourVo: TourVO): Promise<ResponseObject> {
    return await this.coreDAO.update(tourVo.toEntity());
  }

  // TODO: Algorithm for assigning tour
  async assignGuideToTour(tourVo: TourVO): Promise<ResponseObject> {
    return await this.coreDAO.update(tourVo.toEntity());
  }

  // TODO: Algorithm and specifications
  async addActivityToTour(tourVo: TourVO): Promise<ResponseObject> {
    const tourEntity = tourVo.toEntity();
    console.log('SERVICE → tourEntity.activities', tourEntity.activities);
    return await this.coreDAO.update(tourEntity);
  }

  // TODO: Rethink deletes:- Logical delete
  async removeActivityFromTour(tourVo: TourVO): Promise<ResponseObject> {
    for (const activityId in tourVo.activities) {
      tourVo.activities[activityId] = FieldValue.delete();
    }
    return await this.coreDAO.delete(tourVo.toEntity());
  }

  async listActivitiesForTour(tourVo: TourVO): Promise<ResponseObject> {
    // fetch tour with id == tourId
    let response: ResponseObject = await this.coreDAO.findById(
      tourVo.toEntity(),
    );
    if (response.status !== 'success') {
      return response;
    }
    return {
      ...response,
      data: response.data['activities'] as Activity[],
    } as ResponseObject;
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
